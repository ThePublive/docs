#!/usr/bin/env bash
# Preview a docs PR locally.
# Usage: scripts/preview-pr.sh <PR number> [port]
#
# Checks out the PR branch, starts `mint dev`, and opens each changed page
# in the browser. Press Ctrl+C to stop. Your previous branch is restored
# when the preview stops.
set -euo pipefail

PR="${1:?Usage: scripts/preview-pr.sh <PR number> [port]}"
PORT="${2:-3000}"
REPO="ThePublive/docs"

cd "$(dirname "$0")/.."

if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  echo "You have uncommitted changes. Commit or stash them first." >&2
  exit 1
fi

PREV_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
restore() { git switch --quiet "$PREV_BRANCH" && echo "Back on $PREV_BRANCH."; }
trap restore EXIT

gh pr checkout "$PR" --repo "$REPO"

# Changed pages, as URL paths (dxp/foo/bar.mdx -> /dxp/foo/bar)
PAGES=()
while IFS= read -r line; do
  [[ -n "$line" ]] && PAGES+=("$line")
done < <(gh pr diff "$PR" --repo "$REPO" --name-only | grep -E '^(dxp|axp)/.*\.mdx$' | sed -E 's/\.mdx$//; s#^#/#' || true)

echo "Starting mint dev on http://localhost:$PORT ..."
mint dev --port "$PORT" &
MINT_PID=$!
trap 'kill $MINT_PID 2>/dev/null || true; restore' EXIT

# Wait for the server, then open the changed pages.
for _ in $(seq 1 60); do
  curl -s -o /dev/null "http://localhost:$PORT" && break
  sleep 1
done
if [[ ${#PAGES[@]} -eq 0 ]]; then
  open "http://localhost:$PORT"
else
  for p in "${PAGES[@]}"; do
    echo "Opening http://localhost:$PORT$p"
    open "http://localhost:$PORT$p"
  done
fi

wait "$MINT_PID"
