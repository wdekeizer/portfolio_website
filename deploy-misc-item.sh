#!/usr/bin/env bash
set -euo pipefail

# Deploys a standalone project (a game, experiment, etc.) to its own subfolder
# under /lab/ on the live site, independent of the main website repo. Linked
# to from the "Misc. Items" page. (Deployed under /lab/ rather than
# /misc-items/ to avoid colliding with the React app's own /misc-items route.)
#
# Usage: ./deploy-misc-item.sh <slug> <path-to-built-dist-folder>
#   ./deploy-misc-item.sh snake ~/code/snake-game/dist
#
# The project can be anything (plain HTML/JS, Vite, whatever) as long as
# <dist-folder> contains a self-contained static site with an index.html.
# It ends up live at https://williamdekeizer.com/lab/<slug>/
#
# Reads connection details from deploy.env (gitignored) next to this script,
# same file used by deploy.sh.

if [ $# -ne 2 ]; then
  echo "Usage: $0 <slug> <path-to-built-dist-folder>" >&2
  exit 1
fi

SLUG="$1"
DIST_DIR="$2"

if [[ ! "$SLUG" =~ ^[a-z0-9-]+$ ]]; then
  echo "Slug must be lowercase letters, numbers, and hyphens only (got: $SLUG)" >&2
  exit 1
fi

if [ ! -d "$DIST_DIR" ] || [ ! -f "$DIST_DIR/index.html" ]; then
  echo "Error: $DIST_DIR doesn't exist or has no index.html" >&2
  exit 1
fi

cd "$(dirname "$0")"

if [ -f deploy.env ]; then
  set -a
  source deploy.env
  set +a
fi

: "${HOSTINGER_SSH_HOST:?Set HOSTINGER_SSH_HOST (from hPanel > Advanced > SSH Access)}"
: "${HOSTINGER_SSH_PORT:?Set HOSTINGER_SSH_PORT (from hPanel > Advanced > SSH Access)}"
: "${HOSTINGER_SSH_USER:?Set HOSTINGER_SSH_USER (your Hostinger account username, e.g. u225965023)}"

REMOTE_BASE="domains/williamdekeizer.com/public_html/lab"
REMOTE_DIR="${REMOTE_BASE}/${SLUG}"

echo "Uploading ${DIST_DIR} to https://williamdekeizer.com/lab/${SLUG}/ ..."

BATCH_FILE="$(mktemp)"
trap 'rm -f "$BATCH_FILE"' EXIT

{
  echo "-mkdir ${REMOTE_BASE}"
  echo "-mkdir ${REMOTE_DIR}"
  echo "cd ${REMOTE_DIR}"
  echo "lcd ${DIST_DIR}"
  for entry in "$DIST_DIR"/*; do
    name="$(basename "$entry")"
    if [ -d "$entry" ]; then
      echo "put -r ${name}"
    else
      echo "put ${name}"
    fi
  done
} > "$BATCH_FILE"

sftp -P "${HOSTINGER_SSH_PORT}" "${HOSTINGER_SSH_USER}@${HOSTINGER_SSH_HOST}" < "$BATCH_FILE"

echo "Done. Live at https://williamdekeizer.com/lab/${SLUG}/"
