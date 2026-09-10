#!/bin/sh
set -eu
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
root=$(dirname -- "$script_dir")
"$root/scripts/release-check.sh"

scenario_count=0
for scenario in "$root"/examples/evals/*.md; do
  [ -s "$scenario" ] || { echo "Missing evaluation scenarios" >&2; exit 1; }
  for heading in "## Input" "## Expected routing" "## Required evidence" "## Prohibited behavior"; do
    grep -q "^$heading$" "$scenario" || { echo "Invalid scenario $scenario: $heading" >&2; exit 1; }
  done
  scenario_count=$((scenario_count + 1))
done
[ "$scenario_count" -ge 4 ] || { echo "Expected at least four scenarios" >&2; exit 1; }

bundle_target=$(mktemp -d)
codex_target=$(mktemp -d)
hermes_target=$(mktemp -d)
work_target=$(mktemp -d)
trap 'rm -rf "$bundle_target" "$codex_target" "$hermes_target" "$work_target"' EXIT HUP INT TERM
"$root/scripts/bootstrap.sh" --target "$bundle_target" >/dev/null
"$bundle_target/.harness/scripts/validate.sh" >/dev/null
"$root/scripts/install-adapter.sh" --platform codex --target "$codex_target" >/dev/null
"$root/scripts/install-adapter.sh" --platform hermes --target "$hermes_target" >/dev/null
"$root/scripts/install-adapter.sh" --platform work --target "$work_target" >/dev/null
[ -s "$codex_target/.codex/agents/reviewer.toml" ]
[ -s "$codex_target/.agents/skills/harness-router/SKILL.md" ]
[ -s "$hermes_target/.harness-adapters/hermes/PROFILE.md" ]
[ -s "$work_target/.harness-adapters/work/CONTEXT.md" ]
echo "Harness $(cat "$root/VERSION") structural evaluation passed ($scenario_count scenarios)"
