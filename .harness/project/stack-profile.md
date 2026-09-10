# Claw3D stack profile

## Evidence summary

| Area | Observed technology/version | Evidence | Confidence |
|---|---|---|---|
| Runtime | Node.js 20+ | `AGENTS.md`, `package.json` | High |
| Package manager | npm 10+ with `package-lock.json` | `AGENTS.md`, `package-lock.json` | High |
| Frontend | Next.js 16, React 19, TypeScript | `package.json`, `next.config.ts` | High |
| 3D/visual | Three.js, React Three Fiber, Phaser | `package.json` | High |
| Backend | Custom Node server and WebSocket proxy | `server/index.js`, `AGENTS.md` | High |
| Runtime providers | OpenClaw, Hermes, custom/local, demo | `src/lib/runtime`, `docs/runtime-profiles.md` | High |
| Database | No required database | `AGENTS.md` | High |
| Tests | Vitest and Playwright | `vitest.config.ts`, `playwright.config.ts` | High |

## Canonical commands

| Purpose | Command | Evidence |
|---|---|---|
| Setup | `npm install` | `README.md`, `package-lock.json` |
| Development | `npm run dev` | `AGENTS.md`, `package.json` |
| Unit tests | `npm run test -- --run` | `AGENTS.md` |
| Lint | `npm run lint` | `AGENTS.md` |
| Typecheck | `npm run typecheck` | `AGENTS.md` |
| Build | `npm run build` | `AGENTS.md` |
| E2E | `npm run e2e` | `AGENTS.md` |
| Runtime diagnostics | `npm run doctor` | `package.json` |
| Dev smoke test | `npm run smoke:dev-server` | `package.json` |

## Boundaries and current local state

- The OpenClaw runtime checkout must remain outside this repository.
- `.env`, tokens, personal overlays, and host-specific instructions must not be committed.
- `package.json` and `package-lock.json` include the local `zustand` addition.
- npm remains the canonical manager; the temporary `pnpm-workspace.yaml` was removed.
- `node_modules` and `.next` are generated and must not be treated as source.
- A live OpenClaw/Hermes gateway is optional for rendering the connection form but
  required for end-to-end agent data.
