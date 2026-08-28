# Contributing

Keep Proofcheck report-only, evidence-backed, and portable across Claude Code and Codex.

1. Create a focused branch.
2. Add or update a behavioral contract before changing skill rules.
3. Run `npm ci`, `npm test`, `npm run validate`, and `npm pack --dry-run`.
4. Confirm the skill validator passes and manifests remain aligned.
5. Open a concise pull request describing the verification failure being addressed.

Do not add automatic fixes, deployments, dependency installation, or external mutations to the skill workflow.
