#!/bin/bash
# Mantém o app Node (PM2) vivo na Hostinger.
# O daemon PM2 some após reboot/idle — sem crontab no SSH, o proxy PHP chama isto no 502.
set -u
export PATH=/opt/alt/alt-nodejs22/root/usr/bin:/home/u465383396/.local/bin:$PATH
APP=/home/u465383396/apps/gbia
LOCK=/tmp/gbia-keep-alive.lock
LOG=/tmp/gbia-keep-alive.log

# Evita corrida se vários requests 502 disparam ao mesmo tempo
if command -v flock >/dev/null 2>&1; then
  exec 9>"$LOCK"
  flock -n 9 || exit 0
else
  if [[ -f "$LOCK" ]]; then
    age=$(( $(date +%s) - $(stat -c %Y "$LOCK" 2>/dev/null || echo 0) ))
    if (( age < 45 )); then
      exit 0
    fi
  fi
  echo $$ >"$LOCK"
fi

cd "$APP" || exit 1

# Carrega .env para o processo Node (Supabase etc.)
if [[ -f "$APP/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$APP/.env"
  set +a
fi
export NODE_ENV=production
export HOST=127.0.0.1
export PORT=3008
export NITRO_HOST=127.0.0.1
export NITRO_PORT=3008
export VITE_SITE_URL=https://gbia.com.br
export SITE_URL=https://gbia.com.br

alive() {
  curl -sS -o /dev/null --connect-timeout 2 --max-time 4 "http://127.0.0.1:3008/" 2>/dev/null
}

start_app() {
  if [[ ! -f "$APP/server/index.mjs" ]]; then
    echo "$(date -Is) ERRO: server/index.mjs ausente" >>"$LOG"
    return 1
  fi
  if pm2 describe gbia >/dev/null 2>&1; then
    pm2 restart gbia --update-env >/dev/null 2>&1 || pm2 reload ecosystem.config.cjs --update-env >/dev/null 2>&1
  else
    pm2 resurrect >/dev/null 2>&1 || true
    if ! pm2 describe gbia >/dev/null 2>&1; then
      pm2 start ecosystem.config.cjs >/dev/null 2>&1
    fi
  fi
  pm2 save >/dev/null 2>&1 || true
}

if alive; then
  exit 0
fi

echo "$(date -Is) porta 3008 morta — reiniciando" >>"$LOG"
start_app

# Espera o Node subir
for i in 1 2 3 4 5 6 7 8; do
  sleep 1
  if alive; then
    echo "$(date -Is) OK após ${i}s" >>"$LOG"
    exit 0
  fi
done

# Segunda tentativa limpa
echo "$(date -Is) retry start limpo" >>"$LOG"
pm2 delete gbia >/dev/null 2>&1 || true
pm2 start ecosystem.config.cjs >/dev/null 2>&1
pm2 save >/dev/null 2>&1 || true
sleep 2
if alive; then
  echo "$(date -Is) OK no retry" >>"$LOG"
  exit 0
fi

echo "$(date -Is) FALHOU ao subir gbia" >>"$LOG"
exit 1
