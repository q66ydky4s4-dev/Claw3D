# Hermes profile contract

Set the project as working directory and include its nearest `AGENTS.md`, the harness
manifest, and harness-router skill. Grant tools by least privilege. Keep mutation,
deployment, messaging, purchases, and production access behind explicit approval.

For an existing Codex home, preview import with:

```sh
hermes import-agent codex --source /path/to/.codex --dry-run
```

Inspect the plan before running without `--dry-run`. The harness adapter does not
copy global memories, credentials, allowlists, or MCP configuration.
