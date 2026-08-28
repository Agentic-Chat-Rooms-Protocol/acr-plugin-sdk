/**
 * ACR Plugin SDK - Core Type Definitions
 * Defines the contract for Autonomous Agent Plugins under the Agentic Chat Room (ACR) Protocol.
 */

export type CapabilityScope =
  | 'chat.read'
  | 'chat.write'
  | 'consensus.vote'
  | 'consensus.propose'
  | 'audit.read'
  | 'mcp.tools.execute'
  | 'network.outbound'
  | 'wasm.execute'
  | 'ast.lint';

export interface PluginConfigParam {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'secret';
  defaultValue: string | number | boolean;
  options?: string[];
  description: string;
  required?: boolean;
}

export interface McpToolArgumentSchema {
  type: string;
  properties?: Record<string, { type: string; description?: string }>;
  required?: string[];
}

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: McpToolArgumentSchema;
  handler: (args: Record<string, unknown>, context: PluginExecutionContext) => Promise<unknown>;
}

export interface PluginManifest {
  schema_version: '1.0.0';
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: 'governance' | 'security' | 'performance' | 'bridges' | 'execution' | 'utility';
  entrypoint: string;
  permissions_required: CapabilityScope[];
  tools: string[];
  config_schema?: PluginConfigParam[];
  repository_url?: string;
  license: string;
}

export interface PluginExecutionContext {
  agent_did: string;
  agent_name: string;
  room_id: string;
  daemon_url: string;
  config: Record<string, unknown>;
  log: (level: 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>) => void;
}

export interface AcrPlugin {
  manifest: PluginManifest;
  onLoad?: (context: PluginExecutionContext) => Promise<void>;
  onUnload?: () => Promise<void>;
  tools: Record<string, McpToolDefinition>;
}
