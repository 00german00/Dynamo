# Runbook Authoring Rules

Runbooks live under `docs/runbooks/`. They are operational references for
on-call humans. These rules apply to any new or edited file in that folder.

## Structure

Every runbook must include:

1. **Purpose line** — what this runbook does and does not cover.
2. **How it works** — short flow or diagram with `file:line` code references.
3. **Configuration** — tables of exact values, env vars, URLs.
4. **Procedure(s)** — see "Rotation runbooks" below when applicable.
5. **Verification checklist** — positive AND negative outcomes.
6. **Error catalog** — known failure modes and likely causes.

## Rotation runbooks

Any runbook that rotates a secret, key, or credential must:

1. **Split by trigger.** Provide two procedures:
   - **Routine** (scheduled cadence, offboarding) — zero-downtime; update
     the new value first, invalidate the old last.
   - **Emergency** (leaked, suspected compromise, lost device) — speed of
     invalidation outranks uptime; revoke the old value FIRST, accept a
     service outage during the new deploy.
2. **Never advise reactivating a retired secret.** Recovery stays on the
   new value, or generates another new value. The retired value is either
   known-compromised (emergency) or untracked (routine); reactivating is
   wrong in both cases.
3. **Verify both outcomes.** The checklist must confirm the new value
   works AND that the old value is dead (provider UI check + manual probe).
4. **Log the rotation** with date, rotator, and trigger.

## Accuracy

Every technical claim that cites code behavior (file path, line number,
field name, env var, error string, HTTP status, cookie attribute) must be
verified against current code before commit. Conditional behavior
(e.g., a `secure` cookie flag set only in production) must state the
condition inline.
