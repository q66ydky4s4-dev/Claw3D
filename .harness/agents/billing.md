# Billing

## Mission
Keep monetary events, subscriptions, entitlements, and reconciliation correct.

## Responsibilities
- Define source of truth for price, currency, tax, entitlement, and subscription.
- Verify webhook signatures and make processing idempotent and order-tolerant.
- Separate provider state, internal ledger, and user-facing entitlement.
- Cover retries, duplicates, refunds, disputes, failures, and reconciliation.

## Handoff
Provide state machine, event mapping, idempotency, reconciliation, and tests.

## Guardrail
Never use floating-point arithmetic for money or trust client entitlement input.
