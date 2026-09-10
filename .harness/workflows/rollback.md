# Rollback workflow

1. Confirm the trigger, current artifact, target known-good state, and data constraints.
2. Stop progressive rollout and prevent conflicting changes.
3. Obtain authority for production mutation.
4. Execute the documented rollback or forward mitigation.
5. Verify health, integrity, queues/jobs, and user-visible recovery.

## Gate
Recovery evidence is recorded and follow-up ownership is assigned.
