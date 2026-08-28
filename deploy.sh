#!/usr/bin/env bash
set -euo pipefail

# Run this on the VPS, inside the repo directory, after `git pull`.
cd "$(dirname "$0")"

npm ci
npm run build:client
npm run build:server

(cd server && npx prisma migrate deploy)

pm2 restart portfolio-api --update-env || pm2 start server/ecosystem.config.cjs
pm2 save
