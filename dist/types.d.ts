/**
 * ACR Plugin SDK - Core Type Definitions
 * Defines the contract for Autonomous Agent Plugins under the Agentic Chat Room (ACR) Protocol.
 */
export declare const DEFAULT_ACR_DAEMON_URL = "http://127.0.0.1:20443";
export declare const CLERK_OAUTH_SCOPES: readonly ["profile", "email"];
export declare const CANONICAL_CLOUD_TOOLS: readonly ["acr_create_room", "acr_list_workflows", "acr_get_workflow", "acr_configure_workflow", "acr_get_workflow_status", "acr_list_rooms", "acr_room_status", "acr_room_ledger_tail", "acr_room_send", "acr_room_consensus", "acr_container_status"];
export type CanonicalCloudToolName = (typeof CANONICAL_CLOUD_TOOLS)[number];
export declare const CANONICAL_WORKFLOW_IDS: readonly ["postgres-split-brain", "egress-token-anomaly", "ingress-oom-autoscaling", "canary-deployment-rollback", "code-review-tla-verification", "saif-compliance-audit", "bft-consensus-deliberation", "twinseal-passkey-approval", "durable-wal-recovery", "context-compaction-pruning", "byzantine-fault-slashing", "identity-key-rotation", "micro-sandbox-isolation", "cross-model-agentflex-synthesis", "declarative-step-playbook", "postguard-injection-defense", "dynamic-dag-topology", "transitive-trust-federation"];
export type CanonicalWorkflowId = (typeof CANONICAL_WORKFLOW_IDS)[number];
export declare const CANONICAL_WORKFLOW_PRESETS: {
    readonly 'postgres-split-brain': "preset-postgres-split-brain";
    readonly 'egress-token-anomaly': "preset-egress-anomaly";
    readonly 'ingress-oom-autoscaling': "preset-ingress-oom";
    readonly 'canary-deployment-rollback': "preset-canary-rollback";
    readonly 'code-review-tla-verification': "preset-code-review-tla";
    readonly 'saif-compliance-audit': "preset-saif-audit";
    readonly 'bft-consensus-deliberation': "preset-bft-deliberation";
    readonly 'twinseal-passkey-approval': "preset-twinseal-consent";
    readonly 'durable-wal-recovery': "preset-durable-wal-recovery";
    readonly 'context-compaction-pruning': "preset-context-compaction";
    readonly 'byzantine-fault-slashing': "preset-byzantine-slashing";
    readonly 'identity-key-rotation': "preset-identity-rotation";
    readonly 'micro-sandbox-isolation': "preset-micro-sandbox";
    readonly 'cross-model-agentflex-synthesis': "preset-agentflex-synthesis";
    readonly 'declarative-step-playbook': "preset-declarative-playbook";
    readonly 'postguard-injection-defense': "preset-postguard-firewall";
    readonly 'dynamic-dag-topology': "preset-dynamic-dag-topology";
    readonly 'transitive-trust-federation': "preset-trust-federation";
};
export type CanonicalWorkflowPresetId = (typeof CANONICAL_WORKFLOW_PRESETS)[CanonicalWorkflowId];
export type CapabilityScope = 'chat.read' | 'chat.write' | 'consensus.vote' | 'consensus.propose' | 'audit.read' | 'mcp.tools.execute' | 'network.outbound' | 'wasm.execute' | 'ast.lint';
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
    properties?: Record<string, {
        type: string;
        description?: string;
    }>;
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
    workflows?: CanonicalWorkflowId[];
    oauth_scopes?: string[];
    config_schema?: PluginConfigParam[];
    repository_url?: string;
    license: string;
}
export interface PluginExecutionContext {
    agent_did: string;
    agent_name: string;
    room_id: string;
    daemon_url: string;
    api_token?: string;
    config: Record<string, unknown>;
    log: (level: 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>) => void;
}
export interface AcrPlugin {
    manifest: PluginManifest;
    onLoad?: (context: PluginExecutionContext) => Promise<void>;
    onUnload?: () => Promise<void>;
    tools: Record<string, McpToolDefinition>;
}
