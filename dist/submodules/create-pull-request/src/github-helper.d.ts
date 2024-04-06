import { Inputs } from './create-pull-request';
interface Pull {
    number: number;
    html_url: string;
    created: boolean;
}
export declare class GitHubHelper {
    private octokit;
    constructor(githubServerHostname: string, token: string);
    private parseRepository;
    private createOrUpdate;
    getRepositoryParent(headRepository: string): Promise<string | null>;
    createOrUpdatePullRequest(inputs: Inputs, baseRepository: string, headRepository: string): Promise<Pull>;
}
export {};
