# Codex compatibility

- Native anchor: repository `AGENTS.md` plus nearest nested `AGENTS.md`.
- Working context: start in the project directory or explicitly select it.
- Execution: select the relevant `.harness/workflows/*.md` and linked assets.
- Isolation: use local work for direct edits or a worktree for isolated changes.
- Verification: run repository checks, then `.harness/scripts/validate.sh` after
  modifying the harness itself.

Do not copy global Codex configuration into a project automatically. Project
instructions remain auditable and version-controlled.
