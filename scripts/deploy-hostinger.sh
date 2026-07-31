#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519_hostinger}"
SSH_HOST="${SSH_HOST:-u465383396@82.25.67.35}"
SSH_PORT="${SSH_PORT:-65002}"
REMOTE_APP="/home/u465383396/apps/gbia"
REMOTE_WEB="/home/u465383396/domains/gbia.com.br/public_html"

SSH=(ssh -i "$SSH_KEY" -p "$SSH_PORT" -o BatchMode=yes -o IdentitiesOnly=yes -o ConnectTimeout=30)
RSYNC_SSH="ssh -i $SSH_KEY -p $SSH_PORT -o BatchMode=yes -o IdentitiesOnly=yes -o ConnectTimeout=30"

cd "$ROOT"

echo "==> Build"
npm run build:node

# Nitro copia public/ → .output/public/. Garante pastas críticas de imagem.
for dir in lovable-assets gb-studio gb-social-designs references covers lumus-effect lumus-assets; do
  if [[ -d "$ROOT/public/$dir" ]]; then
    mkdir -p "$ROOT/.output/public/$dir"
    rsync -a "$ROOT/public/$dir/" "$ROOT/.output/public/$dir/"
  fi
done

echo "==> Imagens no build"
du -sh .output/public/lovable-assets .output/public/gb-studio .output/public/gb-social-designs .output/public/references 2>/dev/null || true
test -f .output/public/lovable-assets/lookbook/look-01.jpg || { echo "ERRO: look-01.jpg ausente no build"; exit 1; }
test -f .output/public/lovable-assets/social/perfumaria.png || { echo "ERRO: perfumaria.png ausente no build"; exit 1; }
test -f .output/public/lovable-assets/social/consumo-consciente.png || { echo "ERRO: consumo-consciente.png ausente no build"; exit 1; }

# Bundle não pode continuar apontando para CDN Lovable morta (stubs .asset.json)
if command -v rg >/dev/null 2>&1; then
  hits=$(rg -l "/__l5e/assets" .output/public/assets/*.js 2>/dev/null || true)
  if [[ -n "$hits" ]]; then
    echo "ERRO: build ainda contém URLs /__l5e/assets (imagens quebrariam no Hostinger)"
    echo "$hits"
    rg -n "/__l5e/assets" .output/public/assets/*.js | head -20
    exit 1
  fi
fi

echo "==> Garantindo pastas remotas"
"${SSH[@]}" "$SSH_HOST" "mkdir -p '$REMOTE_APP' '$REMOTE_APP/public' '$REMOTE_WEB' ~/bin"

echo "==> Enviando build (.output → apps/gbia)"
rsync -az --delete -e "$RSYNC_SSH" --exclude '.env' "$ROOT/.output/" "$SSH_HOST:$REMOTE_APP/"

echo "==> Reenviando pastas de imagem (garantia explícita)"
rsync -az --delete -e "$RSYNC_SSH" "$ROOT/.output/public/lovable-assets/" "$SSH_HOST:$REMOTE_APP/public/lovable-assets/"
rsync -az --delete -e "$RSYNC_SSH" "$ROOT/.output/public/gb-studio/" "$SSH_HOST:$REMOTE_APP/public/gb-studio/"
rsync -az --delete -e "$RSYNC_SSH" "$ROOT/.output/public/gb-social-designs/" "$SSH_HOST:$REMOTE_APP/public/gb-social-designs/"
rsync -az --delete -e "$RSYNC_SSH" "$ROOT/.output/public/references/" "$SSH_HOST:$REMOTE_APP/public/references/"

echo "==> Enviando ecosystem + keep-alive"
rsync -az -e "$RSYNC_SSH" \
  "$ROOT/deploy/ecosystem.config.cjs" \
  "$ROOT/deploy/keep-gbia-alive.sh" \
  "$ROOT/deploy/cron-gbia-health.sh" \
  "$SSH_HOST:$REMOTE_APP/"
rsync -az -e "$RSYNC_SSH" "$ROOT/deploy/keep-gbia-alive.sh" "$SSH_HOST:~/bin/keep-gbia-alive.sh"
rsync -az -e "$RSYNC_SSH" "$ROOT/deploy/cron-gbia-health.sh" "$SSH_HOST:~/bin/cron-gbia-health.sh"

echo "==> Enviando proxy PHP"
rsync -az -e "$RSYNC_SSH" \
  "$ROOT/deploy/public_html/.htaccess" \
  "$ROOT/deploy/public_html/index.php" \
  "$ROOT/deploy/public_html/health-gbia.php" \
  "$SSH_HOST:$REMOTE_WEB/"

echo "==> Enviando .env"
rsync -az -e "$RSYNC_SSH" "$ROOT/.env" "$SSH_HOST:$REMOTE_APP/.env"

echo "==> Reiniciando PM2"
"${SSH[@]}" "$SSH_HOST" 'bash -s' <<'REMOTE'
set -euo pipefail
export PATH=/opt/alt/alt-nodejs22/root/usr/bin:/home/u465383396/.local/bin:$PATH
chmod +x /home/u465383396/apps/gbia/keep-gbia-alive.sh /home/u465383396/bin/keep-gbia-alive.sh
cd /home/u465383396/apps/gbia
rm -f /home/u465383396/domains/gbia.com.br/public_html/default.php
set -a
# shellcheck disable=SC1091
source /home/u465383396/apps/gbia/.env
set +a
export VITE_SITE_URL=https://gbia.com.br
export SITE_URL=https://gbia.com.br
export HOST=127.0.0.1 PORT=3008 NITRO_HOST=127.0.0.1 NITRO_PORT=3008 NODE_ENV=production
# Start limpo — evita daemon PM2 vazio após idle/reboot da Hostinger
if pm2 describe gbia >/dev/null 2>&1; then
  pm2 delete gbia >/dev/null 2>&1 || true
fi
pm2 start ecosystem.config.cjs
pm2 save
sleep 1
pm2 list
curl -sS -o /dev/null -w "local:%{http_code}\n" http://127.0.0.1:3008/
curl -sS -o /dev/null -w "img-look:%{http_code}\n" http://127.0.0.1:3008/lovable-assets/lookbook/look-01.jpg
curl -sS -o /dev/null -w "img-social:%{http_code}\n" http://127.0.0.1:3008/lovable-assets/social/perfumaria.png
test -f public/lovable-assets/lookbook/look-01.jpg
test -f public/lovable-assets/social/perfumaria.png
bash /home/u465383396/bin/keep-gbia-alive.sh
curl -sS -o /dev/null -w "alive-script:%{http_code}\n" http://127.0.0.1:3008/
REMOTE

echo "==> Smoke público"
curl -sS -o /dev/null -w "home:%{http_code}\n" https://gbia.com.br/
curl -sS -o /dev/null -w "lookbook:%{http_code}\n" https://gbia.com.br/lovable-assets/lookbook/look-01.jpg
curl -sS -o /dev/null -w "social-design:%{http_code}\n" https://gbia.com.br/lovable-assets/social/perfumaria.png
if curl -sS https://gbia.com.br/gb-studio | grep -q "__l5e/assets"; then
  echo "AVISO: HTML ainda menciona __l5e/assets — hard refresh (Cmd+Shift+R)"
else
  echo "OK: /gb-studio sem __l5e/assets no HTML"
fi
if curl -sS https://gbia.com.br/gb-social | grep -q "__l5e/assets"; then
  echo "AVISO: /gb-social ainda menciona __l5e/assets"
else
  echo "OK: /gb-social sem __l5e/assets no HTML"
fi

echo "Deploy OK → https://gbia.com.br"
