import { createPullRequest } from 'create-pull-request/src/create-pull-request'
import { Config } from './config'
import { getInput } from '@actions/core'
import { CoveredProject } from './lcov'
import { context } from '@actions/github'

export function createPr(
  changes: string,
  coveredProjects: CoveredProject[]
): void {
  createPullRequest({
    token: Config.githubToken,
    gitToken: Config.githubToken,
    path: getInput('$GITHUB_WORKSPACE'),
    addPaths: [],
    commitMessage: 'chore: update coverage',
    committer:
      'github-actions[bot] <github-actions[bot]@users.noreply.github.com>',
    author:
      'github-actions[bot] <github-actions[bot]@users.noreply.github.com>',
    signoff: false,
    branch: 'chore/update-coverage',
    deleteBranch: true,
    branchSuffix: '',
    base: '',
    pushToFork: '',
    title: 'chore: update coverage',
    body: buildPrMessage(coveredProjects),
    bodyPath: '',
    labels: [],
    assignees: [],
    reviewers: [],
    teamReviewers: [],
    milestone: Number(''),
    draft: false
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildPrMessage(coveredProjects: CoveredProject[]): string {
  // Get current commit from push event
  const sha = context.sha

  let md = ''
  md += '# Update Coverage Badges\n'
  md += '\n'
  md += `Commit ${sha} changed the coverage for this repository.\n`
  md += 'This PR updates all badges in accordance.\n'
  return md
}
