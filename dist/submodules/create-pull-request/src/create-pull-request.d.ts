export interface Inputs {
    token: string;
    gitToken: string;
    path: string;
    addPaths: string[];
    commitMessage: string;
    committer: string;
    author: string;
    signoff: boolean;
    branch: string;
    deleteBranch: boolean;
    branchSuffix: string;
    base: string;
    pushToFork: string;
    title: string;
    body: string;
    bodyPath: string;
    labels: string[];
    assignees: string[];
    reviewers: string[];
    teamReviewers: string[];
    milestone: number;
    draft: boolean;
}
export declare function createPullRequest(inputs: Inputs): Promise<void>;
