# Installation and activation

## Portable project installation

Preview first:

```sh
./scripts/bootstrap.sh --target /path/to/project --dry-run
```

Install the portable bundle:

```sh
./scripts/bootstrap.sh --target /path/to/project
```

This creates `.harness/` in the target and copies the agents, prompts,
checklists, workflows, templates, manifest, version, and compatibility docs.
Existing files are preserved unless `--force` is supplied.

## Codex

Keep project-wide durable guidance in the target project's `AGENTS.md`. Either
reference `.harness/AGENTS.md` from it or merge the applicable rules after human
review. Start Codex in the target directory so it receives the correct project
context. The bootstrap intentionally does not overwrite a project's root
`AGENTS.md`.

## ChatGPT Work

Use a local project connected to the target folder when filesystem access is
needed. For a ChatGPT project, upload the small set of relevant workflow,
prompt, checklist, and architecture files as project sources. Start a separate
conversation for each distinct deliverable.

## Hermes

Hermes distributions and versions can differ. This bundle therefore uses a
portable `.harness/` directory and does not assume an unverified Hermes command
or global path. Configure Hermes to launch the target directory and include:

- the target `AGENTS.md`;
- `.harness/manifest/harness.yaml`;
- the selected workflow, agent, prompt, and checklist.

Current Hermes documentation supports a preview-first Codex import:

```sh
hermes import-agent codex --source /path/to/.codex --dry-run
hermes import-agent codex --source /path/to/.codex
```

This imports a Codex home/configuration, not an arbitrary project bundle. Install
this harness in the project with `bootstrap.sh`, then point the Hermes task at the
project directory. Confirm syntax with `hermes import-agent --help` when using a
different Hermes release. See `compatibility/hermes.md`.

## Verify

```sh
./scripts/validate.sh
```
