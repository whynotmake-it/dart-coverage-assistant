export declare class GitCommandManager {
    private gitPath;
    private workingDirectory;
    private identityGitOptions?;
    private constructor();
    static create(workingDirectory: string): Promise<GitCommandManager>;
    setIdentityGitOptions(identityGitOptions: string[]): void;
    checkout(ref: string, startPoint?: string): Promise<void>;
    cherryPick(options?: string[], allowAllExitCodes?: boolean): Promise<GitOutput>;
    commit(options?: string[], allowAllExitCodes?: boolean): Promise<GitOutput>;
    config(configKey: string, configValue: string, globalConfig?: boolean, add?: boolean): Promise<void>;
    configExists(configKey: string, configValue?: string, globalConfig?: boolean): Promise<boolean>;
    fetch(refSpec: string[], remoteName?: string, options?: string[], unshallow?: boolean): Promise<void>;
    getConfigValue(configKey: string, configValue?: string): Promise<string>;
    getGitDirectory(): Promise<string>;
    getWorkingDirectory(): string;
    hasDiff(options?: string[]): Promise<boolean>;
    isDirty(untracked: boolean, pathspec?: string[]): Promise<boolean>;
    push(options?: string[]): Promise<void>;
    revList(commitExpression: string[], options?: string[]): Promise<string>;
    revParse(ref: string, options?: string[]): Promise<string>;
    stashPush(options?: string[]): Promise<boolean>;
    stashPop(options?: string[]): Promise<void>;
    status(options?: string[]): Promise<string>;
    symbolicRef(ref: string, options?: string[]): Promise<string>;
    tryConfigUnset(configKey: string, configValue?: string, globalConfig?: boolean): Promise<boolean>;
    tryGetRemoteUrl(): Promise<string>;
    exec(args: string[], allowAllExitCodes?: boolean): Promise<GitOutput>;
}
declare class GitOutput {
    stdout: string;
    stderr: string;
    exitCode: number;
}
export {};
