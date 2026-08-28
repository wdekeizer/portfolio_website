#!/usr/bin/env bash
set -euo pipefail

# Deploys the static client build + PHP API to Hostinger over SSH/rsync.
# Requires SSH access enabled in hPanel (Advanced > SSH Access).
#
# Usage: ./deploy.sh
# Reads connection details from deploy.env (gitignored) next to this script,
# or from HOSTINGER_SSH_HOST / HOSTINGER_SSH_PORT / HOSTINGER_SSH_USER env vars.

cd "$(dirname "$0")"

if [ -f deploy.env ]; then
  set -a
  source deploy.env
  set +a
fi

: "${HOSTINGER_SSH_HOST:?Set HOSTINGER_SSH_HOST (from hPanel > Advanced > SSH Access)}"
: "${HOSTINGER_SSH_PORT:?Set HOSTINGER_SSH_PORT (from hPanel > Advanced > SSH Access)}"
: "${HOSTINGER_SSH_USER:?Set HOSTINGER_SSH_USER (your Hostinger account username, e.g. u225965023)}"

REMOTE_PATH="domains/williamdekeizer.com/public_html"

echo "Building client..."
npm run build:client

echo "Assembling deploy bundle..."
rm -rf .deploy_staging
mkdir -p .deploy_staging
cp -r client/dist/. .deploy_staging/
cp -r server-php/api .deploy_staging/
cp server-php/htaccess-snippet.txt .deploy_staging/.htaccess

echo "Syncing to Hostinger (config.php on the server is left untouched)..."
rsync -avz --delete \
  --exclude 'api/config.php' \
  -e "ssh -p ${HOSTINGER_SSH_PORT}" \
  .deploy_staging/ "${HOSTINGER_SSH_USER}@${HOSTINGER_SSH_HOST}:${REMOTE_PATH}/"

rm -rf .deploy_staging

echo "Done. Deployed to https://williamdekeizer.com"
