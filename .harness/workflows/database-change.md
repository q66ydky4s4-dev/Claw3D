# Database change workflow

1. Database defines the invariant and completes the data change plan.
2. Supabase joins when Supabase artifacts or services are detected.
3. Security reviews authorization, exposed data, and privileged operations.
4. Implementer creates a reversible migration with repository-native tooling.
5. QA validates migration, behavior, rollback/recovery, and integrity.

## Gate
Data checklist passes; production execution remains separately authorized.
