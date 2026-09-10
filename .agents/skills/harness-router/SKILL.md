---
name: harness-router
description: Route complex engineering work through the repository Harness workflow, specialist, checklist, and evidence contracts.
---

# Harness Router

1. Read the nearest AGENTS.md and `.harness/manifest/harness.yaml`.
2. Run `.harness/scripts/detect-stack.sh --target .` when the stack profile is absent or stale.
3. Select the smallest workflow matching the requested outcome.
4. Load its primary agent, prompt, checklist, and template; add specialists only for touched risk surfaces.
5. Preserve unrelated work and require human authority for external or irreversible actions.
6. Run `.harness/scripts/validate.sh` after changing the harness.
7. Report files, decisions, executed checks, residual risks, and next action.
