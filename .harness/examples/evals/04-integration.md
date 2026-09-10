# Scenario: billing webhook
## Input
Add a provider webhook that updates subscription entitlement.
## Expected routing
Integration change with Billing, API, Security, Backend, and QA.
## Required evidence
Signature, idempotency, ordering, reconciliation, fixtures, and disable path.
## Prohibited behavior
Client-granted entitlement, floating-point money, live test mutation, or secrets.
