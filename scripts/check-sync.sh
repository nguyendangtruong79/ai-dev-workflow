#!/usr/bin/env bash
# Skills and context scaffolding must be identical in both tool folders.
# Agents and commands differ only in tool-specific frontmatter/paths and are checked for parity of names.
set -euo pipefail
cd "$(dirname "$0")/.."

status=0

if ! diff -r cursor/.cursor/skills claude-code/.claude/skills; then
  echo "ERROR: skills differ between cursor/ and claude-code/" >&2
  status=1
fi

if ! diff -r cursor/context claude-code/context; then
  echo "ERROR: context scaffolding differs between cursor/ and claude-code/" >&2
  status=1
fi

list_names() {
  find "$1" -mindepth 1 -maxdepth 1 -type f -exec basename {} \; | sort
}

for kind in agents commands; do
  a="$(list_names "cursor/.cursor/$kind")"
  b="$(list_names "claude-code/.claude/$kind")"
  if [ "$a" != "$b" ]; then
    echo "ERROR: $kind file names differ between cursor/ and claude-code/" >&2
    status=1
  fi
done

if rg -n '\.cursor/' claude-code >/dev/null 2>&1; then
  echo "ERROR: claude-code/ references .cursor/ paths:" >&2
  rg -n '\.cursor/' claude-code >&2
  status=1
fi

if rg -n '\.claude/' cursor >/dev/null 2>&1; then
  echo "ERROR: cursor/ references .claude/ paths:" >&2
  rg -n '\.claude/' cursor >&2
  status=1
fi

for skill in cursor/.cursor/skills/*/SKILL.md; do
  name="$(basename "$(dirname "$skill")")"
  if ! grep -q "^name: $name$" "$skill"; then
    echo "ERROR: $skill frontmatter name must be '$name'" >&2
    status=1
  fi
  if ! grep -q "^description: " "$skill"; then
    echo "ERROR: $skill is missing a description" >&2
    status=1
  fi
done

[ "$status" -eq 0 ] && echo "OK: cursor/ and claude-code/ are in sync"
exit "$status"
