export function createMcpTool(definition) {
    return definition;
}
export function definePlugin(config) {
    return {
        manifest: config.manifest,
        onLoad: config.onLoad,
        onUnload: config.onUnload,
        tools: config.tools,
    };
}
export async function executePluginTool(plugin, toolName, args, context) {
    const tool = plugin.tools[toolName];
    if (!tool) {
        throw new Error(`Tool '${toolName}' is not provided by plugin '${plugin.manifest.id}'`);
    }
    return await tool.handler(args, context);
}
