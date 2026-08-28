#!/usr/bin/env bash
set -euo pipefail

# Deploys a standalone project (a game, experiment, etc.) to its own subfolder
# under /lab/ on the live site, independent of the main website repo, and
# registers it in a manifest.json that the "Misc. Items" page reads at
# runtime — so no code change or redeploy of the main site is needed to add
# or update an entry. (Deployed under /lab/ rather than /misc-items/ to avoid
# colliding with the React app's own /misc-items route.)
#
# Usage: ./deploy-misc-item.sh <slug> <path-to-built-dist-folder> "<title>" ["<description>"]
#   ./deploy-misc-item.sh snake ~/code/snake-game/dist "Snake" "Classic snake, built with Canvas"
#
# The project can be anything (plain HTML/JS, Vite, whatever) as long as
# <dist-folder> contains a self-contained static site with an index.html.
# It ends up live at https://williamdekeizer.com/lab/<slug>/
#
# Reads connection details from deploy.env (gitignored) next to this script,
# same file used by deploy.sh.

if [ $# -lt 3 ]; then
  echo "Usage: $0 <slug> <path-to-built-dist-folder> \"<title>\" [\"<description>\"]" >&2
  exit 1
fi

SLUG="$1"
DIST_DIR="$2"
TITLE="$3"
DESCRIPTION="${4:-}"

if [[ ! "$SLUG" =~ ^[a-z0-9-]+$ ]]; then
  echo "Slug must be lowercase letters, numbers, and hyphens only (got: $SLUG)" >&2
  exit 1
fi

if [ ! -d "$DIST_DIR" ] || [ ! -f "$DIST_DIR/index.html" ]; then
  echo "Error: $DIST_DIR doesn't exist or has no index.html" >&2
  exit 1
fi

command -v jq >/dev/null || { echo "jq is required (brew install jq)" >&2; exit 1; }

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

WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

echo "Fetching current manifest..."
FETCH_BATCH="$WORK_DIR/fetch.sftp"
{
  echo "-get ${REMOTE_BASE}/manifest.json ${WORK_DIR}/manifest.json"
} > "$FETCH_BATCH"
sftp -P "${HOSTINGER_SSH_PORT}" "${HOSTINGER_SSH_USER}@${HOSTINGER_SSH_HOST}" < "$FETCH_BATCH" >/dev/null

[ -f "$WORK_DIR/manifest.json" ] || echo "[]" > "$WORK_DIR/manifest.json"

echo "Updating manifest entry for '${SLUG}'..."
jq --arg slug "$SLUG" --arg title "$TITLE" --arg description "$DESCRIPTION" '
  map(select(.slug != $slug)) + [{slug: $slug, title: $title, description: $description}]
' "$WORK_DIR/manifest.json" > "$WORK_DIR/manifest.updated.json"

echo "Uploading ${DIST_DIR} to https://williamdekeizer.com/lab/${SLUG}/ ..."
PUSH_BATCH="$WORK_DIR/push.sftp"
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
  echo "cd ${REMOTE_BASE}"
  echo "lcd ${WORK_DIR}"
  echo "put manifest.updated.json manifest.json"
} > "$PUSH_BATCH"

sftp -P "${HOSTINGER_SSH_PORT}" "${HOSTINGER_SSH_USER}@${HOSTINGER_SSH_HOST}" < "$PUSH_BATCH"

echo "Done. Live at https://williamdekeizer.com/lab/${SLUG}/"
echo "It will appear on the Misc. Items page automatically."
