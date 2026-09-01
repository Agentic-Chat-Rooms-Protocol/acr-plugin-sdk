import { AcrPlugin, McpToolDefinition, PluginExecutionContext, PluginManifest } from './types.js';
export declare function createMcpTool(definition: McpToolDefinition): McpToolDefinition;
export declare function definePlugin(config: {
    manifest: PluginManifest;
    onLoad?: (context: PluginExecutionContext) => Promise<void>;
    onUnload?: () => Promise<void>;
    tools: Record<string, McpToolDefinition>;
}): AcrPlugin;
export declare function executePluginTool(plugin: AcrPlugin, toolName: string, args: Record<string, unknown>, context: PluginExecutionContext): Promise<unknown>;
