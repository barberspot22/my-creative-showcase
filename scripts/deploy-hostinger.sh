#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519_hostinger}"
SSH_HOST="${SSH_HOST:-u465383396@82.25.67.35}"
SSH_PORT="${SSH_PORT:-65002}"
REMOTE_APP="/home/u465383396/apps/gbia"
REMOTE_WEB="/home/u465383396/domains/gbia.com.br/public_html"

SSH=(ssh -i "$SSH_KEY" -p "$SSH_PORT" -o BatchMode=yes -o IdentitiesOnly=yes)
RSYNC_SSH="ssh -i $SSH_KEY -p $SSH_PORT -o BatchMode=yes -o IdentitiesOnly=yes"

cd "$ROOT"

echo "==> Build"
npm run build

echo "==> Garantindo pastas remotas"
"${SSH[@]}" "$SSH_HOST" "mkdir -p '$REMOTE_APP' '$REMOTE_WEB' ~/bin"

echo "==> Enviando build (.output → apps/gbia)"
rsync -az --delete -e "$RSYNC_SSH" --exclude '.env' "$ROOT/.output/" "$SSH_HOST:$REMOTE_APP/"

echo "==> Enviando ecosystem + keep-alive"
rsync -az -e "$RSYNC_SSH" \
  "$ROOT/deploy/ecosystem.config.cjs" \
  "$ROOT/deploy/keep-gbia-alive.sh" \
  "$SSH_HOST:$REMOTE_APP/"
rsync -az -e "$RSYNC_SSH" "$ROOT/deploy/keep-gbia-alive.sh" "$SSH_HOST:~/bin/keep-gbia-alive.sh"

echo "==> Enviando proxy PHP"
rsync -az -e "$RSYNC_SSH" \
  "$ROOT/deploy/public_html/.htaccess" \
  "$ROOT/deploy/public_html/index.php" \
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
if pm2 describe gbia >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
fi
pm2 save
pm2 list
curl -sS -o /dev/null -w "local:%{http_code}\n" http://127.0.0.1:3008/
REMOTE

echo "Deploy OK → https://gbia.com.br"
