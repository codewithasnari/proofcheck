import assert from 'node:assert/strict';
import { access, readFile, rm } from 'node:fs/promises';
import { constants } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
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

test('offline evaluation suite covers five executable scenarios', async () => {
  assert.equal(evals.length, 5);
  assert.deepEqual(evals.map(({ id }) => id), [
    'clean-focused-pass', 'focused-test-failure', 'unavailable-tool', 'historical-evidence', 'unsafe-production-check',
  ]);
  for (const scenario of evals) {
    assert.ok(scenario.prompt.length > 20);
    assert.ok(scenario.expected.length >= 3);
    assert.ok(scenario.fixture, `${scenario.id} needs an executable fixture`);
    const script = new URL(`../${scenario.fixture.script}`, import.meta.url);
    await access(script, constants.X_OK);
    const result = spawnSync(fileURLToPath(script), [scenario.fixture.scenario], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const fixturePath = resolve(result.stdout.trim());
    assert.ok(fixturePath.startsWith(`${resolve(tmpdir())}/proofcheck-eval.`));
    await access(`${fixturePath}/.proofcheck-eval-root`);
    await rm(fixturePath, { recursive: true });
  }
});
