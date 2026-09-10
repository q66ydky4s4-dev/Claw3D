#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
root=$(dirname -- "$script_dir")
"$root/scripts/validate.sh"

version=$(cat "$root/VERSION")
grep -q "^## $version " "$root/CHANGELOG.md"
grep -q "^version: $version$" "$root/manifest/harness.yaml"

echo "Harness $version is release-ready; no deploy, tag, or publish was performed"
