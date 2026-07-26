#!/bin/bash
export PATH=/opt/alt/alt-nodejs22/root/usr/bin:/home/u465383396/.local/bin:$PATH
cd /home/u465383396/apps/gbia || exit 1
if ! pm2 describe gbia >/dev/null 2>&1; then
  pm2 resurrect >/dev/null 2>&1 || pm2 start ecosystem.config.cjs
  pm2 save >/dev/null 2>&1
fi
