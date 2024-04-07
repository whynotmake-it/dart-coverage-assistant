export declare function configureGit(): Promise<void>;
export declare function stashChanges(): Promise<void>;
export declare function checkoutRef(ref: string): Promise<void>;
export declare function popStash(): Promise<boolean>;
export declare function commitAndPushChanges(commitMessage: string): Promise<void>;
/**
 *
 * @returns the changes in the current branch as a string
 */
export declare function getChanges(): Promise<string>;
