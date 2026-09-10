#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
root=$(dirname -- "$script_dir")

required="AGENTS.md README.md INSTALL.md VERSION CHANGELOG.md LICENSE SECURITY.md CONTRIBUTING.md manifest/harness.yaml
docs/system-map.md docs/architecture.md docs/roadmap.md docs/product-engineering.md
docs/quality-assurance.md docs/operations.md
docs/governance.md docs/product-growth.md docs/adapters.md docs/maturity-model.md docs/completion.md
compatibility/codex.md compatibility/work-mode.md compatibility/hermes.md
prompts/task-intake.md prompts/implementation.md prompts/review.md
prompts/frontend-change.md prompts/backend-change.md prompts/data-change.md prompts/integration-change.md
checklists/definition-of-ready.md checklists/definition-of-done.md checklists/release.md
checklists/stack-profile.md checklists/data-change.md checklists/integration-change.md
checklists/risk-matrix.md checklists/accessibility.md checklists/performance-budget.md
checklists/deployment.md checklists/incident.md
workflows/feature.md workflows/review.md workflows/release.md workflows/stack-discovery.md
workflows/product-change.md workflows/database-change.md workflows/integration-change.md
workflows/test-strategy.md workflows/security-review.md workflows/performance-review.md
workflows/accessibility-review.md workflows/delivery.md workflows/incident-response.md workflows/rollback.md
templates/task-brief.md templates/adr.md templates/handoff.md templates/stack-profile.md
templates/integration-contract.md templates/data-change.md templates/risk-matrix.md
templates/threat-model.md templates/assurance-report.md templates/runbook.md
templates/release-packet.md templates/incident-report.md scripts/release-check.sh
templates/decision-log.md templates/project-memory.md templates/governance-exception.md
workflows/decision-record.md workflows/documentation-lifecycle.md workflows/retrospective.md
workflows/product-discovery.md workflows/analytics-instrumentation.md workflows/experiment.md workflows/seo-review.md
checklists/tracking-plan.md checklists/experiment.md checklists/seo.md
templates/product-brief.md templates/tracking-plan.md templates/experiment-plan.md
skills/harness-router/SKILL.md adapters/codex/agents/explorer.toml
adapters/codex/agents/reviewer.toml adapters/codex/agents/qa.toml
adapters/hermes/PROFILE.md adapters/work/CONTEXT.md
checklists/mcp-connection.md templates/tool-contract.md scripts/install-adapter.sh
checklists/release-certification.md templates/evaluation-report.md workflows/harness-evaluation.md
examples/evals/01-feature.md examples/evals/02-incident.md examples/evals/03-experiment.md
examples/evals/04-integration.md ci/github-actions.yml scripts/evaluate.sh"
for path in $required; do
  [ -s "$root/$path" ] || { echo "Missing or empty: $path" >&2; exit 1; }
done

agents="planner architect implementer reviewer qa security performance release
stack-analyst frontend backend api database supabase auth billing integrations ux
test-strategist threat-modeler accessibility devops sre incident-commander
documentation governance knowledge-curator product-manager analytics seo growth experimenter evaluator"
for agent in $agents; do
  [ -s "$root/agents/$agent.md" ] || { echo "Missing agent: $agent" >&2; exit 1; }
  grep -q '^# ' "$root/agents/$agent.md" || { echo "Agent has no title: $agent" >&2; exit 1; }
done

version=$(cat "$root/VERSION")
grep -q "^version: $version$" "$root/manifest/harness.yaml" || {
  echo "VERSION and manifest differ" >&2
  exit 1
}
grep -q "^## $version " "$root/CHANGELOG.md" || {
  echo "VERSION and changelog differ" >&2
  exit 1
}

fixture=$(mktemp -d)
trap 'rm -rf "$fixture"' EXIT HUP INT TERM
touch "$fixture/package.json" "$fixture/pnpm-lock.yaml"
stack_output=$("$root/scripts/detect-stack.sh" --target "$fixture")
echo "$stack_output" | grep -q 'package.json' || { echo "Stack detector missed package.json" >&2; exit 1; }
echo "$stack_output" | grep -q 'pnpm-lock.yaml' || { echo "Stack detector missed pnpm lockfile" >&2; exit 1; }

for config in "$root"/adapters/codex/agents/*.toml; do
  grep -q '^name = ' "$config" || { echo "Codex agent missing name: $config" >&2; exit 1; }
  grep -q '^description = ' "$config" || { echo "Codex agent missing description: $config" >&2; exit 1; }
  grep -q '^developer_instructions = ' "$config" || { echo "Codex agent missing instructions: $config" >&2; exit 1; }
done

echo "Harness $version validation passed"
