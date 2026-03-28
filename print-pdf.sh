#!/usr/bin/env bash
# PDF only: npm run pdf
# PDF + CUPS (Custom media from render geometry): npm run print
set -euo pipefail
cd "$(dirname "$0")"
exec npm run pdf -- "$@"
