import { GitCommandManager } from './git-command-manager';
interface GitRemote {
    hostname: string;
    protocol: string;
    repository: string;
}
export declare class GitConfigHelper {
    private git;
    private gitConfigPath;
    private workingDirectory;
    private safeDirectoryConfigKey;
    private safeDirectoryAdded;
    private remoteUrl;
    private extraheaderConfigKey;
    private extraheaderConfigPlaceholderValue;
    private extraheaderConfigValueRegex;
    private persistedExtraheaderConfigValue;
    private constructor();
    static create(git: GitCommandManager): Promise<GitConfigHelper>;
    close(): Promise<void>;
    addSafeDirectory(): Promise<void>;
    removeSafeDirectory(): Promise<void>;
    fetchRemoteDetail(): Promise<void>;
    getGitRemote(): GitRemote;
    static parseGitRemote(remoteUrl: string): GitRemote;
    savePersistedAuth(): Promise<void>;
    restorePersistedAuth(): Promise<void>;
    configureToken(token: string): Promise<void>;
    removeAuth(): Promise<void>;
    private setExtraheaderConfig;
    private getAndUnset;
    private gitConfigStringReplace;
}
export {};
