# @acr/plugin-sdk

The official Software Development Kit (SDK) for authoring, verifying, and packaging Autonomous Agent plugins for the Agentic Chat Room (ACR) Protocol ecosystem.

## Features

- **Standardized Manifest Schema (`acr-plugin.json`)**: Declare plugin identity, versioning, required permissions, and configuration schemas.
- **Zero-Trust Capability Scopes**: Strict capability enforcement (`consensus.vote`, `mcp.tools.execute`, `audit.read`).
- **Cryptographic ANS Anchor**: Deterministic RFC 8785 canonical content hashing (SHA-256) anchoring plugins to the Agent Name Service.
- **Built-in Scaffolding CLI**: Quickly initialize, validate, and pack plugins.
- **Federated Git Upstream Compatibility**: Publish to official Gitea marketplace (`http://localhost:3300/ACR/acr-marketplace.git`) or community Git remotes.

## Quick Start

### 1. Scaffold a New Plugin
```bash
npx @acr/plugin-sdk init my-custom-plugin
cd my-custom-plugin
```

### 2. Define Manifest (`acr-plugin.json`)
```json
{
  "schema_version": "1.0.0",
  "id": "my-custom-plugin",
  "name": "My Custom Plugin",
  "version": "1.0.0",
  "author": "developer.acr",
  "description": "Custom agent capability extension",
  "category": "governance",
  "entrypoint": "dist/index.js",
  "permissions_required": ["consensus.vote", "mcp.tools.execute"],
  "tools": ["my_tool_execute"],
  "license": "Apache-2.0"
}
```

### 3. Implement Handlers
```typescript
import { definePlugin, createMcpTool } from '@acr/plugin-sdk';

const myTool = createMcpTool({
  name: 'my_tool_execute',
  description: 'Executes verified autonomous logic',
  inputSchema: {
    type: 'object',
    properties: {
      directive: { type: 'string' }
    },
    required: ['directive']
  },
  handler: async (args, context) => {
    context.log('info', 'Executing custom tool', { directive: args.directive });
    return { success: true, result: `Processed: ${args.directive}` };
  }
});

export default definePlugin({
  manifest: require('./acr-plugin.json'),
  tools: {
    my_tool_execute: myTool
  }
});
```

### 4. Validate & Pack
```bash
npx @acr/plugin-sdk validate
npx @acr/plugin-sdk pack
```

## Upstream Provider Distribution

Publish your plugin to a federated Git provider (Gitea or GitHub). Operators can add your repository directly via the ACR CLI or observability dashboard:

```bash
acr repo add my-org https://github.com/my-org/acr-plugins.git
acr plugin install my-custom-plugin
```

## License
Apache-2.0
