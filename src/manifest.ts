import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { PluginManifest } from './types.js';

export function computePluginContentHash(pluginDir: string): string {
  const hash = crypto.createHash('sha256');
  
  function walkDir(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile()) {
        const fileContent = fs.readFileSync(fullPath);
        hash.update(entry.name);
        hash.update(fileContent);
      }
    }
  }

  walkDir(pluginDir);
  return hash.digest('hex');
}

export function validatePluginManifest(manifest: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!manifest || typeof manifest !== 'object') {
    return { valid: false, errors: ['Manifest must be a non-null JSON object'] };
  }

  const m = manifest as Record<string, unknown>;

  if (!m.id || typeof m.id !== 'string' || !/^[a-z0-9-]+$/.test(m.id)) {
    errors.push("Field 'id' is required, string, and kebab-case (e.g. 'my-cool-plugin')");
  }
  if (!m.name || typeof m.name !== 'string') {
    errors.push("Field 'name' is required string");
  }
  if (!m.version || typeof m.version !== 'string' || !/^\d+\.\d+\.\d+/.test(m.version)) {
    errors.push("Field 'version' must follow semantic versioning (e.g. '1.0.0')");
  }
  if (!m.author || typeof m.author !== 'string') {
    errors.push("Field 'author' is required string");
  }
  if (!m.description || typeof m.description !== 'string') {
    errors.push("Field 'description' is required string");
  }
  if (!Array.isArray(m.permissions_required)) {
    errors.push("Field 'permissions_required' must be an array of CapabilityScope");
  }
  if (!Array.isArray(m.tools)) {
    errors.push("Field 'tools' must be an array of MCP tool names");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function loadPluginManifest(manifestPath: string): PluginManifest {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest file not found: ${manifestPath}`);
  }
  const raw = fs.readFileSync(manifestPath, 'utf-8');
  const json = JSON.parse(raw);
  const validation = validatePluginManifest(json);
  if (!validation.valid) {
    throw new Error(`Invalid acr-plugin.json manifest: ${validation.errors.join(', ')}`);
  }
  return json as PluginManifest;
}
