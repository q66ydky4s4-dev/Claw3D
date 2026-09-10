# Operations architecture

Delivery uses immutable artifacts promoted across explicit environments. Configuration
and secrets remain external to artifacts. Every production change needs observable
health signals, a bounded rollout, a rollback trigger, an owner, and human authority.

```mermaid
flowchart LR
  C[Commit] --> Q[Quality gates]
  Q --> A[Immutable artifact]
  A --> E[Environment promotion]
  E --> R[Progressive rollout]
  R --> O[Observe]
  O -->|healthy| D[Complete]
  O -->|trigger| B[Rollback or mitigate]
```

CI verifies; CD prepares and executes only under the repository's authorization model.
