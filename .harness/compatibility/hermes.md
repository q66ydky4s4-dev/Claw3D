# Hermes compatibility contract

The stable interface is the bundle, not a particular Hermes CLI release.

Hermes should:

1. set the target project as the working directory;
2. load the nearest `AGENTS.md` and `.harness/manifest/harness.yaml`;
3. select one workflow and its agent, prompt, and checklist dependencies;
4. preserve file paths and Markdown/YAML content;
5. return command output as evidence;
6. require explicit authority for external or irreversible effects.

Before adding a concrete Hermes adapter, capture `hermes --version` and the
relevant built-in help. Add versioned adapter fixtures and validation in Part 7.

For an existing Codex home, current Hermes releases document
`hermes import-agent codex --source /path/to/.codex --dry-run`, followed by the
same command without `--dry-run` after reviewing the plan. This is separate from
the project-local `.harness/` installation.
