import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CANONICAL_CLOUD_TOOLS,
  CANONICAL_WORKFLOW_IDS,
  CANONICAL_WORKFLOW_PRESETS,
  CLERK_OAUTH_SCOPES,
  DEFAULT_ACR_DAEMON_URL,
} from '../dist/types.js';
import {
  isCanonicalCloudTool,
  isCanonicalWorkflowId,
  isCanonicalWorkflowOrPreset,
  loadPluginManifest,
  validatePluginManifest,
} from '../dist/manifest.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

describe('ACR Plugin SDK Manifest Validation & Canonical Contracts', () => {
  it('exposes exactly 11 Cloud tools and 18 canonical workflows', () => {
    assert.equal(CANONICAL_CLOUD_TOOLS.length, 11);
    assert.equal(CANONICAL_WORKFLOW_IDS.length, 18);
    assert.equal(Object.keys(CANONICAL_WORKFLOW_PRESETS).length, 18);
    assert.deepEqual([...CLERK_OAUTH_SCOPES], ['profile', 'email']);
    assert.equal(DEFAULT_ACR_DAEMON_URL, 'http://127.0.0.1:20443');
    assert.equal(isCanonicalCloudTool('acr_create_room'), true);
    assert.equal(isCanonicalCloudTool('acr_container_status'), true);
    assert.equal(isCanonicalCloudTool('nonexistent_tool'), false);
    assert.equal(isCanonicalWorkflowId('bft-consensus-deliberation'), true);
    assert.equal(isCanonicalWorkflowOrPreset('preset-bft-deliberation'), true);
    assert.equal(isCanonicalWorkflowOrPreset('unknown-workflow'), false);
  });

  it('validates a valid manifest with canonical workflows and oauth_scopes', () => {
    const manifest = {
      id: 'hello-consensus',
      name: 'Hello Consensus',
      version: '1.0.1',
      author: '@acr-js',
      description: 'A sample consensus plugin',
      permissions_required: ['chat.read', 'consensus.vote'],
      tools: ['acr_room_consensus', 'acr_room_send'],
      workflows: ['bft-consensus-deliberation', 'twinseal-passkey-approval'],
      oauth_scopes: ['profile', 'email'],
    };
    const res = validatePluginManifest(manifest);
    assert.equal(res.valid, true);
    assert.equal(res.errors.length, 0);
  });

  it('validates examples/hello-consensus/acr-plugin.json', () => {
    const manifest = loadPluginManifest(
      path.join(repoRoot, 'examples', 'hello-consensus', 'acr-plugin.json')
    );
    assert.equal(manifest.id, 'hello-consensus');
    assert.deepEqual(manifest.workflows, ['bft-consensus-deliberation']);
    assert.ok(manifest.tools.every((t) => isCanonicalCloudTool(t) || t === 'hello_consensus_ping'));
  });

  it('rejects invalid manifest and unknown canonical workflow IDs', () => {
    const res = validatePluginManifest({});
    assert.equal(res.valid, false);
    assert.ok(res.errors.length > 0);

    const badWf = validatePluginManifest({
      id: 'bad-wf',
      name: 'Bad Workflow',
      version: '1.0.0',
      author: '@acr-js',
      description: 'Invalid workflow test',
      permissions_required: ['chat.read'],
      tools: ['acr_room_send'],
      workflows: ['invented-noncanonical-workflow'],
    });
    assert.equal(badWf.valid, false);
    assert.match(badWf.errors[0], /Invalid canonical workflow identifier/);
  });

  it('uses @acr-js/plugin-sdk in CLI scaffold generator', () => {
    const cliSource = fs.readFileSync(path.join(repoRoot, 'bin', 'acr-plugin-sdk.js'), 'utf-8');
    assert.ok(cliSource.includes("'@acr-js/plugin-sdk'"));
    assert.equal(cliSource.includes("'@acr/plugin-sdk'"), false);
  });
});
