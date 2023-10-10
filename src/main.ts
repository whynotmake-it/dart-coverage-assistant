import * as core from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { generateBadges } from './badge'
import { createComment, findPreviousComment, updateComment } from './comment'
import { Config } from './config'
import { findProjects } from './finder'
import { checkoutRef, commitAndPushChanges, configureGit } from './git'
import { coverProject, parseLcovBefore } from './lcov'
import { buildMessage } from './message'
import { verifyCoverageThreshold, verifyNoCoverageDecrease } from './semaphor'

/**
 * The main function for the action.
 */
export async function run(): Promise<void> {
  try {
    core.info(`Finding projects...`)

    const projects = await findProjects(null)
    core.info(`Found ${projects.length} projects`)

    core.info(`Parsing coverage...`)
    let projectsWithCoverage = await Promise.all(projects.map(coverProject))

    if (Config.compareAgainstBase && context.payload.pull_request) {
      try {
        await checkoutRef(context.payload.pull_request.base.ref)
        projectsWithCoverage = await Promise.all(
          projectsWithCoverage.map(parseLcovBefore)
        )
        await checkoutRef(context.payload.pull_request.head.ref)
      } catch (error) {
        core.warning(`Failed to checkout base ref due to ${error}.`)
      }
    }

    /// Projects that actually have coverage
    const coveredProjects = projectsWithCoverage.filter(p => p.coverage?.length)

    core.info(
      `${coveredProjects.filter(p => p.coverage).length} projects covered.`
    )

    // If we are in a Push event and generateBadges is true, generate badges
    if (Config.generateBadges && context.eventName === 'push') {
      try {
        core.info(`Configuring git...`)
        await configureGit()

        core.info('Updating and pushing coverage badge...')
        await generateBadges(coveredProjects)
        await commitAndPushChanges('chore: coverage badges [skip ci]')
      } catch (error) {
        core.warning(
          `Failed to commit and push coverage badge due to ${error}.`
        )
      }
    }

    const pr = context.payload.pull_request
    if (pr) {
      core.info(`Building message...`)
      const message = buildMessage(
        coveredProjects,
        pr.html_url ?? '',
        pr.head.sha
      )

      core.setOutput('message', message)
      try {
        await comment(message)
      } catch (error) {
        core.warning(`Failed to comment due to ${error}.`)
      }
    }

    const coverageThresholdMet = verifyCoverageThreshold(coveredProjects)
    const noDecreaseMet = verifyNoCoverageDecrease(coveredProjects)
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
  } else {
    core.info(`Not a pull request, skipping comment`)
  }
}
