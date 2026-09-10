# Product engineering architecture

Part 2 begins with evidence, not a presumed stack. `detect-stack.sh` reports only
signals found in the target repository. The Stack Analyst converts those signals
into a reviewed profile; specialists are activated from that profile and the
requested change.

```mermaid
flowchart LR
  R[Repository] --> D[Detect stack]
  D --> P[Stack profile]
  P --> U[Frontend and UX]
  P --> S[Backend and API]
  P --> X[Database and Supabase]
  P --> C[Auth and Billing]
  P --> I[Integrations]
  U --> G[Core quality gates]
  S --> G
  X --> G
  C --> G
  I --> G
```

Specialists activate only for touched surfaces. The primary implementer owns the
change; specialists define domain constraints and review evidence.
