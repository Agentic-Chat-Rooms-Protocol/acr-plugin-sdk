import { type CanonicalCloudToolName, type CanonicalWorkflowId, type PluginManifest } from './types.js';
export declare function isCanonicalCloudTool(name: string): name is CanonicalCloudToolName;
export declare function isCanonicalWorkflowId(id: string): id is CanonicalWorkflowId;
export declare function isCanonicalWorkflowOrPreset(id: string): boolean;
export declare function computePluginContentHash(pluginDir: string): string;
export declare function validatePluginManifest(manifest: unknown): {
    valid: boolean;
    errors: string[];
};
export declare function loadPluginManifest(manifestPath: string): PluginManifest;
