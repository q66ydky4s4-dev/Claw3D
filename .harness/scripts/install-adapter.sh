#!/bin/sh
set -eu

usage() { echo "Usage: $0 --platform codex|hermes|work --target PATH [--dry-run] [--force]"; }
platform=""
target=""
dry_run=0
force=0
while [ "$#" -gt 0 ]; do
  case "$1" in
    --platform) [ "$#" -ge 2 ] || { usage >&2; exit 2; }; platform=$2; shift 2 ;;
    --target) [ "$#" -ge 2 ] || { usage >&2; exit 2; }; target=$2; shift 2 ;;
    --dry-run) dry_run=1; shift ;;
    --force) force=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; usage >&2; exit 2 ;;
  esac
done
[ -d "$target" ] || { echo "Target is not a directory: $target" >&2; exit 2; }

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
root=$(dirname -- "$script_dir")
case "$platform" in
  codex)
    sources="$root/adapters/codex/agents $root/skills/harness-router"
    destinations="$target/.codex/agents $target/.agents/skills/harness-router"
    ;;
  hermes|work)
    sources="$root/adapters/$platform"
    destinations="$target/.harness-adapters/$platform"
    ;;
  *) usage >&2; exit 2 ;;
esac

set -- $sources
source_one=$1
set -- $destinations
destination_one=$1
if [ -e "$destination_one" ] && [ "$force" -ne 1 ]; then
  echo "Destination exists: $destination_one (use --force)" >&2
  exit 3
fi
if [ "$dry_run" -eq 1 ]; then
  echo "Would install $platform adapter into $target"
  exit 0
fi

if [ "$platform" = codex ]; then
  mkdir -p "$target/.codex/agents" "$target/.agents/skills/harness-router"
  cp -R "$root/adapters/codex/agents/." "$target/.codex/agents"
  cp -R "$root/skills/harness-router/." "$target/.agents/skills/harness-router"
else
  mkdir -p "$target/.harness-adapters/$platform"
  cp -R "$root/adapters/$platform/." "$target/.harness-adapters/$platform"
fi
echo "Installed $platform adapter into $target"
