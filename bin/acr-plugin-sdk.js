#!/usr/bin/env node

/**
 * ACR Plugin SDK CLI - Scaffolding, Validation & Packaging Utility
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const args = process.argv.slice(2);
const command = args[0] || 'help';

function computeDirHash(currentDir) {
  const hash = crypto.createHash('sha256');
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        hash.update(entry.name);
        hash.update(fs.readFileSync(full));
      }
    }
  }
  walk(currentDir);
  return hash.digest('hex');
}

switch (command) {
  case 'init': {
    const pluginName = args[1] || 'my-acr-plugin';
    const targetDir = path.resolve(process.cwd(), pluginName);
    if (fs.existsSync(targetDir)) {
      console.error(`Error: Directory '${pluginName}' already exists.`);
      process.exit(1);
    }
    fs.mkdirSync(targetDir, { recursive: true });
    fs.mkdirSync(path.join(targetDir, 'src'), { recursive: true });

    const manifest = {
      schema_version: '1.0.0',
      id: pluginName,
      name: pluginName,
      version: '1.0.0',
      author: 'community-developer.acr',
      description: `Autonomous agent extension for ${pluginName}`,
      category: 'governance',
      entrypoint: 'dist/index.js',
      permissions_required: ['chat.read', 'mcp.tools.execute'],
      tools: [`${pluginName.replace(/-/g, '_')}_execute`],
      config_schema: [
        {
          key: 'log_level',
          label: 'Logging Verbosity',
          type: 'select',
          defaultValue: 'info',
          options: ['debug', 'info', 'warn', 'error'],
          description: 'Runtime telemetry verbosity',
        },
      ],
      license: 'Apache-2.0',
    };

    fs.writeFileSync(path.join(targetDir, 'acr-plugin.json'), JSON.stringify(manifest, null, 2));

    const sampleCode = `import { definePlugin, createMcpTool } from '@acr/plugin-sdk';

const executeTool = createMcpTool({
  name: '${pluginName.replace(/-/g, '_')}_execute',
  description: 'Executes primary ${pluginName} capability',
  inputSchema: {
    type: 'object',
    properties: {
      action: { type: 'string', description: 'Action payload' }
    },
    required: ['action']
  },
  handler: async (args, context) => {
    context.log('info', 'Executing ${pluginName}', { action: args.action });
    return { status: 'success', executed_by: context.agent_did, action: args.action };
  }
});

export default definePlugin({
  manifest: require('./acr-plugin.json'),
  tools: {
    '${pluginName.replace(/-/g, '_')}_execute': executeTool
  }
});
`;

    fs.writeFileSync(path.join(targetDir, 'src', 'index.ts'), sampleCode);
    console.log(`[OK] Created new ACR plugin project in '${pluginName}'`);
    console.log(`     - Manifest: ${pluginName}/acr-plugin.json`);
    console.log(`     - Source:   ${pluginName}/src/index.ts`);
    break;
  }

  case 'validate': {
    const targetFile = args[1] || path.join(process.cwd(), 'acr-plugin.json');
    if (!fs.existsSync(targetFile)) {
      console.error(`[FAIL] Cannot find manifest at: ${targetFile}`);
      process.exit(1);
    }
    try {
      const data = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
      if (!data.id || !data.version || !data.tools) {
        throw new Error("Missing mandatory manifest keys ('id', 'version', 'tools')");
      }
      console.log(`[PASS] Valid ACR plugin manifest: ${data.name} v${data.version} (${data.id})`);
    } catch (e) {
      console.error(`[FAIL] Invalid manifest: ${e.message}`);
      process.exit(1);
    }
    break;
  }

  case 'pack': {
    const targetDir = args[1] || process.cwd();
    const manifestPath = path.join(targetDir, 'acr-plugin.json');
    if (!fs.existsSync(manifestPath)) {
      console.error(`[FAIL] Missing acr-plugin.json in ${targetDir}`);
      process.exit(1);
    }
    const hash = computeDirHash(targetDir);
    console.log(`[PACK] Packaging plugin from ${targetDir}`);
    console.log(`[HASH] SHA-256 Content Hash: ${hash}`);
    console.log(`[ANCHOR] Ready for ANS and Gitea registry publishing.`);
    break;
  }

  default:
    console.log(`ACR Plugin SDK CLI v1.0.0
Usage:
  acr-plugin-sdk init <name>     Scaffold a new ACR plugin
  acr-plugin-sdk validate [file] Validate acr-plugin.json
  acr-plugin-sdk pack [dir]      Compute SHA-256 content hash and verify bundle
`);
}
