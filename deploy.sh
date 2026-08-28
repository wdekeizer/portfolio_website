#!/usr/bin/env bash
set -euo pipefail

# Deploys the static client build + PHP API to Hostinger over SFTP.
# Requires SSH access enabled in hPanel (Advanced > SSH Access).
# Uses plain SFTP rather than rsync because Hostinger shared hosting accounts
# use a restricted login shell (no shell exec), which breaks rsync-over-ssh.
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
mkdir -p .deploy_staging/api
cp -r client/dist/. .deploy_staging/
cp server-php/htaccess-snippet.txt .deploy_staging/.htaccess
for f in server-php/api/*.php; do
  base="$(basename "$f")"
  # config.php holds live secrets and already exists on the server; never overwrite it from here.
  if [ "$base" = "config.php" ] || [ "$base" = "config.example.php" ]; then
    continue
  fi
  cp "$f" ".deploy_staging/api/$base"
done

echo "Uploading via SFTP..."
BATCH_FILE="$(mktemp)"
trap 'rm -f "$BATCH_FILE"' EXIT

{
  echo "cd ${REMOTE_PATH}"
  echo "lcd .deploy_staging"
  for entry in .deploy_staging/*; do
    name="$(basename "$entry")"
    if [ -d "$entry" ]; then
      echo "put -r ${name}"
    else
      echo "put ${name}"
    fi
  done
} > "$BATCH_FILE"

sftp -P "${HOSTINGER_SSH_PORT}" "${HOSTINGER_SSH_USER}@${HOSTINGER_SSH_HOST}" < "$BATCH_FILE"

rm -rf .deploy_staging

echo "Done. Deployed to https://williamdekeizer.com"
