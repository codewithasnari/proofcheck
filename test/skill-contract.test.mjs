import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const skill = await readFile(new URL('../skills/proofcheck/SKILL.md', import.meta.url), 'utf8');
const selection = await readFile(new URL('../skills/proofcheck/references/check-selection.md', import.meta.url), 'utf8');
const report = await readFile(new URL('../skills/proofcheck/references/report-format.md', import.meta.url), 'utf8');
const evals = JSON.parse(await readFile(new URL('../evals/evals.json', import.meta.url), 'utf8'));

test('skill is report-only and forbids false completion claims', () => {
  assert.match(skill, /report-only/i);
  assert.match(skill, /Do not edit source/);
  assert.match(skill, /Never report an unrun test as passing/);
  assert.match(skill, /READY.*fresh passing evidence/s);
  assert.match(skill, /NOT READY.*failed/s);
  assert.match(skill, /INCOMPLETE.*skipped, unavailable, historical-only, or unverified/s);
});

test('check selection is scoped and protects external systems', () => {
  assert.match(selection, /changed files and diff/i);
  assert.match(selection, /project-owned commands/i);
  assert.match(selection, /production access, deployments, migrations/i);
  assert.match(selection, /do not install dependencies/i);
});

test('report contract preserves exact evidence and all four states', () => {
  for (const state of ['passed', 'failed', 'skipped', 'unavailable']) assert.match(report, new RegExp(state));
  assert.match(report, /historical/);
  assert.match(report, /Do not collapse counts or normalize exact result wording/);
});

test('offline evaluation suite covers five discriminating scenarios', () => {
  assert.equal(evals.length, 5);
  assert.deepEqual(evals.map(({ id }) => id), [
    'clean-focused-pass', 'focused-test-failure', 'unavailable-tool', 'historical-evidence', 'unsafe-production-check',
  ]);
  for (const scenario of evals) {
    assert.ok(scenario.prompt.length > 20);
    assert.ok(scenario.expected.length >= 3);
  }
});
