import { GitHub } from '@actions/github/lib/utils';
import { IssueComment, ReportedContentClassifiers } from '@octokit/graphql-schema';
type CreateCommentResponse = Awaited<ReturnType<InstanceType<typeof GitHub>['rest']['issues']['createComment']>>;
export declare function findPreviousComment(octokit: InstanceType<typeof GitHub>, repo: {
    owner: string;
    repo: string;
}, number: number, header: string): Promise<IssueComment | undefined>;
export declare function updateComment(octokit: InstanceType<typeof GitHub>, id: string, body: string, header: string, previousBody?: string): Promise<void>;
export declare function createComment(octokit: InstanceType<typeof GitHub>, repo: {
    owner: string;
    repo: string;
}, issue_number: number, body: string, header: string, previousBody?: string): Promise<CreateCommentResponse | undefined>;
export declare function deleteComment(octokit: InstanceType<typeof GitHub>, id: string): Promise<void>;
export declare function minimizeComment(octokit: InstanceType<typeof GitHub>, subjectId: string, classifier: ReportedContentClassifiers): Promise<void>;
export declare function getBodyOf(previous: {
    body: string;
}, append: boolean, hideDetails: boolean): string | undefined;
export declare function commentsEqual(body: string, previous: string, header: string): boolean;
export {};
