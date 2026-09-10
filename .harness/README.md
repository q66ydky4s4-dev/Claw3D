# Harness Engineering

Versioned, portable operating guidance for planning, implementing, reviewing,
testing, securing, optimizing, and releasing software with Hermes, Codex, and
ChatGPT Work.

## Start here

```sh
cd harness
./scripts/validate.sh
./scripts/bootstrap.sh --target /path/to/project --dry-run
```

Read [the system map](docs/system-map.md), choose a workflow from `workflows/`,
and use its named agent, prompt, and checklist. The manifest at
`manifest/harness.yaml` is the machine-readable inventory and compatibility
contract.

## Design principles

- Files are plain Markdown, YAML, and POSIX shell.
- Guidance is layered, explicit, reviewable, and versioned.
- Adapters copy only portable assets; host-specific behavior stays documented.
- Checks are proportional to change risk.
- Human authority is retained for destructive or external actions.

## Current contents

- Foundation: manifest, version, changelog, license, and nested instructions.
- Architecture: lifecycle, module boundaries, naming, and compatibility.
- Core roles: planner, architect, implementer, reviewer, QA, security,
  performance, and release.
- Execution assets: initial prompts, checklists, workflows, templates, bootstrap,
  and validation.
- Product engineering: stack discovery plus frontend, backend, API, database,
  Supabase, authentication, billing, integrations, and UX specialists.

Discover a target project's stack without modifying it:

```sh
./scripts/detect-stack.sh --target /path/to/project
```

See `docs/roadmap.md` for subsequent modules.

## Stable release

Version 1.0.0 completes Parts 1–8. Run `./scripts/evaluate.sh` for full
structural certification.
