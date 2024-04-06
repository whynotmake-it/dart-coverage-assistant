import { GitCommandManager } from './git-command-manager';
export declare enum WorkingBaseType {
    Branch = "branch",
    Commit = "commit"
}
export declare function getWorkingBaseAndType(git: GitCommandManager): Promise<[string, WorkingBaseType]>;
export declare function tryFetch(git: GitCommandManager, remote: string, branch: string): Promise<boolean>;
interface CreateOrUpdateBranchResult {
    action: string;
    base: string;
    hasDiffWithBase: boolean;
    headSha: string;
}
export declare function createOrUpdateBranch(git: GitCommandManager, commitMessage: string, base: string, branch: string, branchRemoteName: string, signoff: boolean, addPaths: string[]): Promise<CreateOrUpdateBranchResult>;
export {};
