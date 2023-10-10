import * as core from '@actions/core'
import { findProjects } from './finder'
import { coverProject } from './lcov'
import { buildMessage } from './message'
import { verifyCoverageThreshold, verifyNoCoverageDecrease } from './semaphor'
import { checkout, commitAndPushChanges, configureGit } from './git'
import { generateBadges } from './badge'
import { context, getOctokit } from '@actions/github'
import { Config } from './config'
import { findPreviousComment, createComment, updateComment } from './comment'
import { GitHub } from '@actions/github/lib/utils'

/**
 * The main function for the action.
 */
export async function run(): Promise<void> {
  try {
    core.info(`Finding projects...`)

    const projects = await findProjects(null)
    core.info(`Found ${projects.length} projects`)

    core.info(`Parsing coverage...`)
    const projectsWithCoverage = await Promise.all(projects.map(coverProject))

    /// Projects that actually have coverage
    const coveredProjects = projectsWithCoverage.filter(p => p.coverage?.length)

    core.info(
      `${coveredProjects.filter(p => p.coverage).length} projects covered.`
    )

    // If we are in a Pull request and should generate badges
    if (Config.generateBadges && context.payload.pull_request) {
      try {
        core.info(`Configuring git...`)
        await configureGit()
        const branch = context.ref
        core.info(`Checking out ${branch}...`)

        await checkout(branch)
        core.info('Updating and pushing coverage badge...')
        await generateBadges(coveredProjects)
        await commitAndPushChanges('chore: coverage badges [skip ci]')
      } catch (error) {
        core.warning(
          `Failed to commit and push coverage badge due to ${error}.`
        )
      }
    }

    core.info(`Building message...`)
    const message = buildMessage(coveredProjects)

    const coverageThresholdMet = verifyCoverageThreshold(coveredProjects)
    const noDecreaseMet = verifyNoCoverageDecrease(coveredProjects)

    core.setOutput('message', message)
    try {
      await comment(message)
    } catch (error) {
      core.warning(`Failed to comment due to ${error}.`)
    }

    if (!coverageThresholdMet || !noDecreaseMet) {
      core.setFailed('Configured conditions were not met.')
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function comment(body: string): Promise<void> {
  const octokit = getOctokit(Config.githubToken)
  const header = 'dart-coverage-assistant'
  if (context.payload.pull_request) {
    const previous = await findPreviousComment(
      octokit,
      context.repo,
      context.payload.pull_request?.number,
      header
    )
    if (previous) {
      core.info(`Updating previous comment #${previous.id}`)
      await updateComment(octokit, previous.id, body, header)
    } else {
      core.info(`Writing a new comment`)
      await createComment(
        octokit,
        context.repo,
        context.payload.pull_request?.number,
        body,
        header
      )
    }
  }
}
