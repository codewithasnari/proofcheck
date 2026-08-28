---
name: proofcheck
description: Verify whether code or project work is actually complete using fresh, scoped evidence. Use when the user asks to verify, validate, double-check, prove, confirm a fix, check readiness, run the relevant tests, or asks whether work is done, ready, correct, safe to merge, or safe to ship. Produce a report only; do not fix failures or mutate external systems.
---

# Proofcheck

Verify completion claims with observable evidence. Do not infer that work is correct because code looks plausible, another agent said it passed, or a previous session reported success.

## Boundary

This is a report-only workflow.

- Do not edit source, configuration, tests, snapshots, generated files, or lockfiles.
- Do not install dependencies, commit, push, merge, deploy, approve, or post external results.
- Do not run destructive, production, secret-bearing, billing, migration, or externally mutating checks without explicit authorization.
- If verification reveals a failure, report it. Do not fix it unless the user separately asks for a fix.

Read [check-selection.md](references/check-selection.md) when choosing commands. Read [report-format.md](references/report-format.md) before reporting results.

## Workflow

1. Establish the claim and scope. Inspect the current repository state, relevant diff, project instructions, and existing scripts before selecting checks. Do not broaden verification to unrelated packages or services.
2. Identify the smallest evidence set that can prove or disprove the claim. Prefer project-owned commands over invented commands.
3. Run authorized local checks. Capture the exact command, exit status, and concise observed outcome. Do not rewrite tool wording or counts.
4. Exercise the actual changed behavior when practical. A typecheck alone does not prove runtime behavior; a broad suite alone may not prove the focused fix.
5. Classify every relevant check as `passed`, `failed`, `skipped`, or `unavailable`. Never omit a relevant check merely because it could not run.
6. Report the verdict and evidence. A completion verdict is allowed only when all required checks passed and no material check is skipped or unavailable.

## Evidence rules

- **Fresh:** You ran the exact command during this verification and observed the result.
- **Historical:** The user, a note, CI, or another agent supplied the result; you did not rerun it. Preserve its provenance and exact concise wording.
- **Unverified:** A claim has no supporting result. It cannot contribute to a passing verdict.

Never describe historical or unverified evidence as fresh. Never report an unrun test as passing. If the environment prevents a check, mark it `unavailable` and state the concrete reason.

## Verdicts

- **READY:** Every material requirement has fresh passing evidence.
- **NOT READY:** At least one material check failed.
- **INCOMPLETE:** No check failed, but a material check was skipped, unavailable, historical-only, or unverified.

Lead with the verdict. Keep evidence auditable and concise. Separate findings from suggestions; suggested fixes are not performed by this skill.
