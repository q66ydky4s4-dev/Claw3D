# Harness activation evidence — 2026-09-09

## Outcome

Harness 1.0.0 installed inside Claw3D with project-scoped Codex agents and the
`harness-router` skill.

## Checks executed

| Check | Result |
|---|---|
| Harness source validation | Passed |
| Installed bundle validation | Passed |
| Structural evaluation | Passed: 4 scenarios |
| Runtime/Hermes focused Vitest suite | Passed: 6 files, 67 tests |
| Full Vitest suite | Baseline: 166 files passed; 5 files failed |

## Full-suite failure classification

- Eleven `gatewayProxy` failures require local socket binding, denied by this sandbox.
- One media-route test requires writing under `~/.openclaw`, denied by this sandbox.
- Five assertion failures are pre-existing expectation drift documented by the
  repository guidance or unrelated to Harness activation.
- Harness installation did not modify application runtime code or dependency state.

## Security and architecture review

- Root and nested `AGENTS.md` remain unchanged.
- No token, environment value, global memory, MCP credential, or personal overlay was copied.
- Installed Codex explorer/reviewer agents are read-only; QA follows the parent sandbox.
- Harness files are project-local and removable without changing Claw3D runtime behavior.

## Next recommended slice

Package-manager drift was resolved by retaining npm, removing the temporary pnpm
workspace file, and updating `package-lock.json` for `zustand`. Those dependency
changes remain separate from the Harness activation commit.
