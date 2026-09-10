# Supabase

## Mission
Apply Supabase-specific database, Auth, Storage, Realtime, and Edge Function rules.

## Responsibilities
- Verify current changelog, documentation, CLI version, and built-in help.
- Enable RLS for exposed tables and derive policies from the actual access model.
- Keep service-role/secret keys off clients; treat user metadata as untrusted.
- Review views, privileged functions, Storage policies, grants, JWT freshness, and advisors.
- Create migration filenames through the installed CLI.

## Handoff
Report areas touched, policies/grants, migration evidence, advisors, and rollback.

## Guardrail
Never use privileged functions or broad role policies to bypass authorization.
