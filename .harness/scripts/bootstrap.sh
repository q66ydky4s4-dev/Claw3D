#!/bin/sh
set -eu

usage() {
  echo "Usage: $0 --target PATH [--force] [--dry-run]"
}

target=""
force=0
dry_run=0
while [ "$#" -gt 0 ]; do
  case "$1" in
    --target) [ "$#" -ge 2 ] || { usage; exit 2; }; target=$2; shift 2 ;;
    --force) force=1; shift ;;
    --dry-run) dry_run=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; usage >&2; exit 2 ;;
  esac
done

[ -n "$target" ] || { usage >&2; exit 2; }
[ -d "$target" ] || { echo "Target is not a directory: $target" >&2; exit 2; }

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
root=$(dirname -- "$script_dir")
destination=$target/.harness

if [ -e "$destination" ] && [ "$force" -ne 1 ]; then
  echo "Destination exists: $destination (use --force to update)" >&2
  exit 3
fi

if [ "$dry_run" -eq 1 ]; then
  echo "Would install Harness $(cat "$root/VERSION") to $destination"
  exit 0
fi

mkdir -p "$destination"
for item in AGENTS.md README.md INSTALL.md VERSION CHANGELOG.md LICENSE SECURITY.md CONTRIBUTING.md agents prompts workflows checklists templates manifest compatibility docs scripts skills adapters examples ci; do
  if [ -d "$root/$item" ]; then
    mkdir -p "$destination/$item"
    cp -R "$root/$item/." "$destination/$item"
  else
    cp "$root/$item" "$destination/$item"
  fi
done
echo "Installed Harness $(cat "$root/VERSION") to $destination"
