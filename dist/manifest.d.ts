import { PluginManifest } from './types.js';
export declare function computePluginContentHash(pluginDir: string): string;
export declare function validatePluginManifest(manifest: unknown): {
    valid: boolean;
    errors: string[];
};
export declare function loadPluginManifest(manifestPath: string): PluginManifest;
