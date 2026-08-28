# proofcheck

A report-only verification skill for Claude Code and Codex. It checks whether work is actually ready using fresh, scoped evidence instead of trusting confident completion claims.

## What it does

- Inspects the changed surface and project-owned scripts before selecting checks.
- Runs focused tests, typechecks, builds, and behavior checks proportional to the claim.
- Records exact commands and concise observed results.
- Classifies checks as `passed`, `failed`, `skipped`, or `unavailable`.
- Separates fresh evidence from supplied historical and unverified claims.
- Returns `READY`, `NOT READY`, or `INCOMPLETE`.

Proofcheck never edits code, installs dependencies, commits, pushes, deploys, approves, or silently fixes failures. Production, destructive, paid, secret-bearing, and externally mutating checks require separate explicit authorization.

## Architecture

The product is Markdown-first. `skills/proofcheck/SKILL.md` defines the boundary and workflow; its references cover check selection and the report format. The only runtime code is a dependency-free Node.js startup update checker. Repository-only Node tests validate behavior contracts, manifests, hooks, CI policy, and packaging.

## Install

### Claude Code

```text
/plugin marketplace add Kyaa-A/proofcheck
/plugin install proofcheck@proofcheck
```

### Codex

```bash
codex plugin marketplace add Kyaa-A/proofcheck
codex plugin add proofcheck@proofcheck
```

Start a fresh Codex session, open `/hooks`, review the startup command, and trust it to enable update notices.

### Plain skill

Copy `skills/proofcheck` into `~/.claude/skills/proofcheck` or `~/.agents/skills/proofcheck`. Plain copies do not receive startup update checks.

## Usage

Ask naturally:

- "Verify this is ready."
- "Proofcheck this fix."
- "Are we actually safe to merge?"
- "Run the relevant checks and show me the evidence."

Explicit Codex invocation: `$proofcheck verify this work`.

## Updates

Managed installs show an informational notice when a newer version is available. The hook never downloads or installs code.

Claude Code:

```bash
claude plugin marketplace update proofcheck
claude plugin update proofcheck@proofcheck
```

Codex:

```bash
codex plugin marketplace upgrade proofcheck
codex plugin remove proofcheck@proofcheck
codex plugin add proofcheck@proofcheck
```

Set `PROOFCHECK_UPDATE_CHECK=0` to disable the managed-plugin check.

## Development

Requires Node.js 20+.

```bash
npm ci
npm test
npm run validate
npm pack --dry-run
```

CI runs the same gates with SHA-pinned GitHub Actions.

## License

MIT. Copyright (c) 2026 Asnari Pacalna.
