# Adapter architecture

The portable bundle remains the source of truth. Host adapters expose only supported
discovery/configuration shapes and never copy secrets, global preferences, memories,
or MCP credentials. Run the installer with `--dry-run` before writing.

- Codex: project agents in `.codex/agents/` and skill in `.agents/skills/`.
- Hermes: portable profile contract and confirmed `import-agent codex` guidance.
- Work: a curated context pack for one outcome; local projects can use files directly.

External MCP connections remain opt-in and must declare tool purpose, permissions,
data classes, and whether calls mutate external state.
