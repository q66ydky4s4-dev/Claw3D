# Quality assurance system

Quality is risk-weighted. Start with the changed behavior and failure impact, then
select the smallest checks that can falsify important assumptions.

| Risk | Required evidence |
|---|---|
| Low | Targeted automated check or deterministic manual reproduction |
| Medium | Success, failure, boundary, regression, and relevant specialist review |
| High | Threat model, integration/e2e evidence, rollback, observability, human gate |

Security, accessibility, and performance are attributes of acceptance criteria,
not final cosmetic reviews. A skipped gate must name the reason, risk, and owner.
