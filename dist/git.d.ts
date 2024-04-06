export declare function stashChanges(): Promise<void>;
export declare function checkoutRef(ref: string): Promise<void>;
export declare function popStash(): Promise<boolean>;
/**
 *
 * @returns the changes in the current branch as a string
 */
export declare function getChanges(): Promise<string>;
