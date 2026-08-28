import { AcrPlugin, McpToolDefinition, PluginExecutionContext, PluginManifest } from './types.js';

export function createMcpTool(definition: McpToolDefinition): McpToolDefinition {
  return definition;
}

export function definePlugin(config: {
  manifest: PluginManifest;
  onLoad?: (context: PluginExecutionContext) => Promise<void>;
  onUnload?: () => Promise<void>;
  tools: Record<string, McpToolDefinition>;
}): AcrPlugin {
  return {
    manifest: config.manifest,
    onLoad: config.onLoad,
    onUnload: config.onUnload,
    tools: config.tools,
  };
}

export async function executePluginTool(
  plugin: AcrPlugin,
  toolName: string,
  args: Record<string, unknown>,
  context: PluginExecutionContext
): Promise<unknown> {
  const tool = plugin.tools[toolName];
  if (!tool) {
    throw new Error(`Tool '${toolName}' is not provided by plugin '${plugin.manifest.id}'`);
  }
  return await tool.handler(args, context);
}
