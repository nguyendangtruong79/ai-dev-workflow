#!/usr/bin/env bash
# Install the AI dev workflow into a target project.
# Usage: ./install.sh <cursor|claude> [target-dir] [--force]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
exec node "$ROOT/bin/cli.js" "$@"
