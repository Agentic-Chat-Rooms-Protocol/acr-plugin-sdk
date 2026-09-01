import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validatePluginManifest } from '../dist/manifest.js';

describe('ACR Plugin SDK Manifest Validation', () => {
  it('should validate a valid manifest', () => {
    const manifest = {
      id: 'hello-consensus',
      name: 'Hello Consensus',
      version: '1.0.0',
      author: 'ACR Foundation',
      description: 'A sample consensus plugin',
      permissions_required: ['chat.read', 'vote.cast'],
      tools: ['hello_tool']
    };
    const res = validatePluginManifest(manifest);
    assert.equal(res.valid, true);
    assert.equal(res.errors.length, 0);
  });

  it('should reject invalid manifest', () => {
    const res = validatePluginManifest({});
    assert.equal(res.valid, false);
    assert.ok(res.errors.length > 0);
  });
});
