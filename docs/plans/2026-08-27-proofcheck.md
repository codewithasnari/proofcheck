# Proofcheck Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Publish a report-only verification skill that produces evidence-backed completion reports without changing project state.

**Architecture:** Keep behavioral guidance in `skills/proofcheck/SKILL.md` and conditional detail in `references/check-selection.md` and `references/report-format.md`. Package it with the proven cross-host updater, canonical manifests, repository validation, pinned CI, and offline behavioral evaluations.

**Tech Stack:** Markdown skill, Node.js 20 test tooling, YAML validation, Claude/Codex plugin manifests, GitHub Actions.

---

### Task 1: Define behavior with failing evaluations

**Files:** Create `evals/evals.json`, offline fixtures, and `test/skill-contract.test.mjs`.

1. Define clean pass, failed focused test, unavailable tool, supplied historical evidence, and unsafe production-check scenarios.
2. Assert exact command evidence, four-state reporting, scope-aware check selection, no false pass, and report-only behavior.
3. Run tests and confirm failure because the skill is absent.

### Task 2: Create the skill

**Files:** Create `skills/proofcheck/SKILL.md`, references, and `agents/openai.yaml`.

1. Initialize the skill with the official skill initializer.
2. Implement concise trigger and workflow guidance.
3. Add check-selection and output-schema references.
4. Validate the skill and make the contract tests pass.

### Task 3: Package the plugin

**Files:** Create Claude/Codex manifests and marketplaces, hook, updater, repository validator, package metadata, and tests.

1. Adapt the current reviewed TLDR packaging for Proofcheck v0.1.0.
2. Preserve one auto-discovered cross-host hook and manual-only updates.
3. Add strict identity, version, policy, hook, SemVer, CI, and package validation.

### Task 4: Add public project files and CI

**Files:** Create README, LICENSE, SECURITY, CONTRIBUTING, CODE_OF_CONDUCT, CITATION, pinned CI, and Dependabot.

1. Document report-only behavior, installation, usage, updates, architecture, and testing.
2. Add MIT copyright for Asnari Pacalna.
3. Run all tests, evaluations, validators, package audit, and diff checks.

### Task 5: Publish and install

1. Review the complete implementation and address blockers.
2. Create public `Kyaa-A/proofcheck` and push `main` without force.
3. Install v0.1.0 in Claude and Codex.
4. Confirm both hosts enable it and remote `main` matches local.
