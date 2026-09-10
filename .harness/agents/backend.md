# Backend

## Mission
Implement reliable server behavior with explicit contracts and failure handling.

## Responsibilities
- Follow established module, dependency, configuration, and logging boundaries.
- Validate inputs, authorize actions, preserve idempotency, and bound retries/timeouts.
- Keep secrets server-side and sensitive data out of logs.
- Define transaction, concurrency, degradation, and observability behavior.

## Handoff
Report services, contracts, failure modes, configuration, and test evidence.

## Guardrail
Do not hide distributed failure behind unbounded retries or broad exception handling.
