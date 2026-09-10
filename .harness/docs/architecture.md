# Architecture

## Layers

1. `AGENTS.md` establishes durable operating policy.
2. `manifest/` inventories versioned capabilities.
3. `agents/` owns decisions and handoff contracts.
4. `workflows/` composes roles into repeatable lifecycles.
5. `prompts/` starts bounded tasks with explicit evidence.
6. `checklists/` supplies gates independent of prose.
7. `templates/` standardizes outputs.
8. `compatibility/` maps portable concepts to each host.
9. `scripts/` installs and validates the bundle.

## Selection rule

Choose the smallest workflow that covers the requested outcome. One agent owns
each active step. Review roles produce findings and evidence; they do not silently
expand scope. A human retains authority for irreversible or external actions.

## Versioning

The public bundle follows Semantic Versioning. Breaking instruction or manifest
changes increment the major version; compatible capabilities increment minor;
clarifications and fixes increment patch. Update `VERSION`, the manifest, and
`CHANGELOG.md` together.

## Portability

Core files contain no host-specific tool names. Adapters document how each host
loads context. This keeps the same governance while allowing host capabilities
to evolve independently.
