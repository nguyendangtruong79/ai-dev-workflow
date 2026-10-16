#!/usr/bin/env bash
# Edit skills in cursor/.cursor/skills, then run this to mirror them into claude-code/.
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf claude-code/.claude/skills claude-code/context
cp -R cursor/.cursor/skills claude-code/.claude/skills
cp -R cursor/context claude-code/context

echo "Synced skills and context scaffolding: cursor/ -> claude-code/"
