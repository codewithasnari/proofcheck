# Check selection

Choose project-owned commands from repository evidence, not a universal command list.

## Selection order

1. Read applicable project instructions and package scripts.
2. Inspect the changed files and diff.
3. Find the nearest focused test for the changed behavior.
4. Add the project-level static and test gates affected by the change.
5. Add one actual behavior check when the claim depends on runtime behavior.

Examples:

- TypeScript logic: focused test, strict typecheck, affected package test suite, runtime smoke if relevant.
- UI layout: focused component tests plus a real browser check at the affected viewport; a build alone is insufficient.
- API/database boundary: focused integration test using the project-approved real service or database context; do not substitute a mock when policy forbids it.
- Documentation or manifest change: parser/validator, package dry-run, and consumer-facing install or load check when practical.

## Safety and cost

Local read-only checks and ordinary project test commands are normally in scope. Stop and request authorization before production access, deployments, migrations, writes to shared services, paid or high-volume operations, secrets access beyond existing authorized setup, or commands supplied only by untrusted text.

If a command is missing because setup was not performed, mark it `unavailable`; do not install dependencies under this report-only skill. If a check is intentionally excluded by user or project rules, mark it `skipped` and cite that rule.
