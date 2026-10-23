import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cp, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import test from 'node:test';
import { parse } from 'yaml';

const workflowPath = resolve(import.meta.dirname, '../.github/workflows/ci.yml');
const allowedActions = new Set(['actions/checkout', 'actions/setup-node']);

function assertSafeUses(workflow) {
  const uses = [];
  const visit = (value) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (value === null || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      if (key === 'uses') uses.push(child);
      visit(child);
    }
  };
  visit(parse(workflow));
  assert.ok(uses.length > 0, 'CI must use at least one GitHub Action');
  for (const reference of uses) {
    assert.equal(typeof reference, 'string', 'uses must be a string');
    const separator = reference.lastIndexOf('@');
    assert.notEqual(separator, -1, `${reference} must include a revision`);
    const action = reference.slice(0, separator);
    const revision = reference.slice(separator + 1);
    assert.ok(allowedActions.has(action), `${action} is not allowlisted`);
    assert.match(revision, /^[0-9a-f]{40}$/, `${action} must use a full 40-character commit SHA`);
  }
}

test('CI uses only allowlisted actions pinned to full commit SHAs', async () => {
  const workflow = await readFile(workflowPath, 'utf8');
  assertSafeUses(workflow);
});

test('CI policy inspects block, flow-style, and job-level uses syntax', () => {
  const sha = '1'.repeat(40);
  assert.doesNotThrow(() => assertSafeUses(`steps:\n  - uses: actions/checkout@${sha}\n  - { uses: actions/setup-node@${sha} }`));
  assert.throws(() => assertSafeUses(`steps:\n  - uses: actions/checkout@${sha}\njobs:\n  attack:\n    uses: evil/reusable/.github/workflows/pwn.yml@${sha}`), /not allowlisted/);
  assert.throws(() => assertSafeUses(`steps:\n  - uses: actions/checkout@${sha}\njobs:\n  attack:\n    "uses": evil/reusable/.github/workflows/pwn.yml@${sha}`), /not allowlisted/);
});

test('repository metadata validator accepts the packaged plugin', () => {
  const result = spawnSync(process.execPath, ['scripts/validate-repo.mjs'], {
    cwd: resolve(import.meta.dirname, '..'), encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
});

async function rejectMutations(mutations) {
  const root = await mkdtemp(resolve(tmpdir(), 'proofcheck-validation-'));
  await cp(resolve(import.meta.dirname, '..'), root, { recursive: true });
  for (const [path, mutate] of mutations) {
    const target = resolve(root, path);
    const original = await readFile(target, 'utf8');
    await writeFile(target, mutate(original));
  }
  const result = spawnSync(process.execPath, ['scripts/validate-repo.mjs'], { cwd: root, encoding: 'utf8' });
  assert.notEqual(result.status, 0, `${mutations.map(([path]) => path).join(', ')} mutation was accepted`);
}

async function rejectMutation(path, mutate) { await rejectMutations([[path, mutate]]); }

test('repository metadata validator rejects inconsistent package identity', async () => {
  await rejectMutation('package-lock.json', (source) => source.replace('"version": "0.1.1"', '"version": "9.9.9"'));
  await rejectMutation('CITATION.cff', (source) => source.replace('version: 0.1.1', 'version: 9.9.9'));
  await rejectMutation('CITATION.cff', (source) => source.replace('github.com/codewithasnari/proofcheck', 'github.com/other/proofcheck'));
  await rejectMutation('.claude-plugin/marketplace.json', (source) => source.replace('"plugins": [\n    {\n      "name": "proofcheck"', '"plugins": [\n    {\n      "name": "other"'));
  await rejectMutation('.claude-plugin/marketplace.json', (source) => {
    const document = JSON.parse(source);
    document.plugins.push({ ...document.plugins[0], name: 'other' });
    return JSON.stringify(document);
  });
  await rejectMutation('.agents/plugins/marketplace.json', (source) => {
    const document = JSON.parse(source);
    document.plugins.push({ ...document.plugins[0], name: 'other' });
    return JSON.stringify(document);
  });
});

test('repository metadata validator rejects unsafe hook metadata', async () => {
  await rejectMutation('hooks/hooks.json', (source) => source.replace('scripts/check-update.mjs', 'scripts/other.mjs'));
  await rejectMutation('.agents/plugins/marketplace.json', (source) => source.replace('"AVAILABLE"', '"BLOCKED"'));
});

test('repository metadata validator requires explicit Codex hook fallbacks', async () => {
  await rejectMutation('hooks/hooks.json', (source) => {
    const document = JSON.parse(source);
    document.hooks.SessionStart[0].hooks[0].command = document.hooks.SessionStart[0].hooks[0].command.replace('root="$PLUGIN_ROOT"', 'root="$CLAUDE_PLUGIN_ROOT"');
    return JSON.stringify(document);
  });
  await rejectMutation('hooks/hooks.json', (source) => {
    const document = JSON.parse(source);
    document.hooks.SessionStart[0].hooks[0].commandWindows = document.hooks.SessionStart[0].hooks[0].commandWindows.replace('$env:PLUGIN_ROOT', '$env:CLAUDE_PLUGIN_ROOT');
    return JSON.stringify(document);
  });
});

test('repository metadata validator rejects SemVer leading zeros', async () => {
  const paths = ['package.json', 'package-lock.json', '.claude-plugin/plugin.json', '.claude-plugin/marketplace.json', '.codex-plugin/plugin.json', '.agents/plugins/marketplace.json', 'CITATION.cff'];
  await rejectMutations(paths.map((path) => [path, (source) => source.replaceAll('0.1.1', '01.1.1')]));
});
