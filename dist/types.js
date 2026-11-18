/**
 * ACR Plugin SDK - Core Type Definitions
 * Defines the contract for Autonomous Agent Plugins under the Agentic Chat Room (ACR) Protocol.
 */
export const DEFAULT_ACR_DAEMON_URL = 'http://127.0.0.1:20443';
export const CLERK_OAUTH_SCOPES = ['profile', 'email'];
export const CANONICAL_CLOUD_TOOLS = [
    'acr_create_room',
    'acr_list_workflows',
    'acr_get_workflow',
    'acr_configure_workflow',
    'acr_get_workflow_status',
    'acr_list_rooms',
    'acr_room_status',
    'acr_room_ledger_tail',
    'acr_room_send',
    'acr_room_consensus',
    'acr_container_status',
];
export const CANONICAL_WORKFLOW_IDS = [
    'postgres-split-brain',
    'egress-token-anomaly',
    'ingress-oom-autoscaling',
    'canary-deployment-rollback',
    'code-review-tla-verification',
    'saif-compliance-audit',
    'bft-consensus-deliberation',
    'twinseal-passkey-approval',
    'durable-wal-recovery',
    'context-compaction-pruning',
    'byzantine-fault-slashing',
    'identity-key-rotation',
    'micro-sandbox-isolation',
    'cross-model-agentflex-synthesis',
    'declarative-step-playbook',
    'postguard-injection-defense',
    'dynamic-dag-topology',
    'transitive-trust-federation',
];
export const CANONICAL_WORKFLOW_PRESETS = {
    'postgres-split-brain': 'preset-postgres-split-brain',
    'egress-token-anomaly': 'preset-egress-anomaly',
    'ingress-oom-autoscaling': 'preset-ingress-oom',
    'canary-deployment-rollback': 'preset-canary-rollback',
    'code-review-tla-verification': 'preset-code-review-tla',
    'saif-compliance-audit': 'preset-saif-audit',
    'bft-consensus-deliberation': 'preset-bft-deliberation',
    'twinseal-passkey-approval': 'preset-twinseal-consent',
    'durable-wal-recovery': 'preset-durable-wal-recovery',
    'context-compaction-pruning': 'preset-context-compaction',
    'byzantine-fault-slashing': 'preset-byzantine-slashing',
    'identity-key-rotation': 'preset-identity-rotation',
    'micro-sandbox-isolation': 'preset-micro-sandbox',
    'cross-model-agentflex-synthesis': 'preset-agentflex-synthesis',
    'declarative-step-playbook': 'preset-declarative-playbook',
    'postguard-injection-defense': 'preset-postguard-firewall',
    'dynamic-dag-topology': 'preset-dynamic-dag-topology',
    'transitive-trust-federation': 'preset-trust-federation',
};
