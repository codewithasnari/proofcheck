# Proofcheck Design

Proofcheck is a report-only verification skill for Claude Code and Codex. It activates when users ask whether work is done, ready, fixed, safe to ship, or properly tested.

The skill inspects repository evidence, selects checks proportional to the changed surface, runs only authorized local verification, and reports every check as `passed`, `failed`, `skipped`, or `unavailable`. Fresh results include the exact command and concise observed outcome. Supplied historical evidence is labeled separately and never upgraded to fresh.

Proofcheck does not edit code, install dependencies, commit, push, deploy, approve releases, or reinterpret an unrun check as passing. Destructive, production, secret-bearing, or externally mutating checks require explicit authorization. The package remains Markdown-first, with supporting references for check selection and report structure plus realistic offline evaluations.

Distribution matches the other independent skills: public `Kyaa-A/proofcheck`, Claude and Codex plugin manifests, MIT license, pinned CI, safe manual update notices, tests, and local managed-plugin installation.
