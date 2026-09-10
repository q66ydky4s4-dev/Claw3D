# Integration change workflow

1. Integrations completes the provider contract and data classification.
2. API, Auth, Billing, or Security join for their respective boundaries.
3. Implementer uses fixtures or sandbox and adds bounded failure handling.
4. QA exercises success, invalid input/signature, timeout, retry, duplicate, and quota.
5. Reviewer verifies least privilege, redaction, disable path, and compatibility.

## Gate
Integration checklist passes; unverified provider assumptions are explicit.
