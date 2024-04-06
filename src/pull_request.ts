import { createPullRequest } from "create-pull-request/src/create-pull-request";
import { Config } from "./config";
import { getInput } from "@actions/core";
import { CoveredProject } from "./lcov";
import { context } from "@actions/github";

export function createPr(changes: string, coveredProjects: CoveredProject[]) {
    createPullRequest({
        token: Config.githubToken,
        gitToken: Config.githubToken,
        path: getInput('$GITHUB_WORKSPACE'),
        addPaths: [],
        commitMessage: "chore: update coverage",
        committer: "github-actions[bot] <github-actions[bot]@users.noreply.github.com>",
        author: "github-actions[bot] <github-actions[bot]@users.noreply.github.com>",
        signoff: false,
        branch: "chore/update-coverage",
        deleteBranch: true,
        branchSuffix: "",
        base: "",
        pushToFork: "",
        title: "chore: update coverage",
        body: buildPrMessage(coveredProjects),
        bodyPath: "",
        labels: [],
        assignees: [],
        reviewers: [],
        teamReviewers: [],
        milestone: Number(""),
        draft: false,
    });

}

function buildPrMessage(coveredProjects: CoveredProject[]): string {
    // Get current commit from push event
    const sha = context.sha;
    const url = context.payload.repository?.html_url;

    let md = ''
    md += '# Update Coverage\n'
    md += '\n'
    md += `Commit (${sha})[${url}] changed the coverage for this repository.\n`
    md += 'This PR updates all files in accordance.\n'
    return md;
}