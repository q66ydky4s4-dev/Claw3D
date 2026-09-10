# Delivery workflow

1. Release creates the release packet and identifies the exact artifact.
2. DevOps verifies CI, environment, permissions, migration, and rollback mechanics.
3. SRE confirms signals, thresholds, capacity, and runbook ownership.
4. A human authorizes production execution.
5. Roll out progressively, observe each stage, then complete or stop/rollback.

## Gate
Deployment checklist passes and authorization is explicit.
