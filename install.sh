#!/usr/bin/env bash
# Install the AI dev workflow into a target project.
# Usage: ./install.sh <cursor|claude> [target-dir] [--force]
set -euo pipefail

usage() {
  echo "Usage: $0 <cursor|claude> [target-dir] [--force]"
  echo "  cursor  -> copies cursor/.cursor and cursor/context"
  echo "  claude  -> copies claude-code/.claude and claude-code/context"
  echo "  --force -> overwrite existing files (default: skip them)"
}

TOOL=""
TARGET="."
FORCE=0
for arg in "$@"; do
  case "$arg" in
    cursor|claude) TOOL="$arg" ;;
    --force) FORCE=1 ;;
    -h|--help) usage; exit 0 ;;
    *) TARGET="$arg" ;;
  esac
done

if [ -z "$TOOL" ]; then usage; exit 1; fi
if [ ! -d "$TARGET" ]; then echo "Target directory not found: $TARGET" >&2; exit 1; fi

SRC_ROOT="$(cd "$(dirname "$0")" && pwd)"
TARGET="$(cd "$TARGET" && pwd)"
if [ "$TARGET" = "$SRC_ROOT" ]; then echo "Target must be your project, not this repo." >&2; exit 1; fi

case "$TOOL" in
  cursor) SRC="$SRC_ROOT/cursor"; CFG=".cursor" ;;
  claude) SRC="$SRC_ROOT/claude-code"; CFG=".claude" ;;
esac

copied=0
skipped=0
for dir in "$CFG" "context"; do
  while IFS= read -r -d '' file; do
    rel="${file#"$SRC"/}"
    dest="$TARGET/$rel"
    mkdir -p "$(dirname "$dest")"
    if [ -e "$dest" ] && [ "$FORCE" -eq 0 ]; then
      echo "skip (exists): $rel"
      skipped=$((skipped + 1))
    else
      cp "$file" "$dest"
      copied=$((copied + 1))
    fi
  done < <(find "$SRC/$dir" -type f -print0)
done

mkdir -p "$TARGET/context/project" "$TARGET/context/features" "$TARGET/context/bugs"

echo
echo "Installed AI dev workflow for $TOOL into $TARGET"
echo "  copied: $copied, skipped: $skipped"
echo
echo "Next steps:"
echo "  1. Open the project in $( [ "$TOOL" = cursor ] && echo Cursor || echo 'Claude Code' )"
echo "  2. Run /onboard to generate context/project/"
echo "  3. Run /feature <your requirement> or /bugfix <bug description>"
echo "  4. Commit $CFG/ and context/ so your team shares the workflow"
