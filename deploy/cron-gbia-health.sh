#!/bin/bash
# Script para Cron Jobs do hPanel (Hostinger).
# No hPanel → Avançado → Cron Jobs → Custom, comando:
#   /bin/bash /home/u465383396/bin/cron-gbia-health.sh
# Frequência: a cada 5 minutos (*/5 * * * *)
set -u
export PATH=/opt/alt/alt-nodejs22/root/usr/bin:/home/u465383396/.local/bin:/usr/bin:/bin:$PATH
bash /home/u465383396/bin/keep-gbia-alive.sh >>/tmp/gbia-keep-alive.log 2>&1
curl -fsS "https://gbia.com.br/health-gbia.php?k=gbia-health-2026" >>/tmp/gbia-keep-alive.log 2>&1 || true
