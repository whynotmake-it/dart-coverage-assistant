import * as core from '@actions/core'
import { findProjects } from './finder'
import { coverProject } from './lcov'
import { buildMessage } from './message'
import { verifyCoverageThreshold, verifyNoCoverageDecrease } from './semaphor'
import { commitAndPushChanges, configureGit } from './git'
import { generateBadges } from './badge'
import { context } from '@actions/github'

/**
 * The main function for the action.
 * @returns {Promise<string>} Returns the message that can be used as a code coverage report
 */
export async function run(): Promise<void> {
  try {
    core.info(`Configuring git...`)
    await configureGit()
    core.info(`Finding projects...`)

    const projects = await findProjects(null)
    core.info(`Found ${projects.length} projects`)

    core.info(`Parsing coverage...`)
    const coveredProjects = await Promise.all(projects.map(coverProject))

    core.info(
      `${coveredProjects.filter(p => p.coverage).length} projects covered.`
    )

    core.info('Updating and pushing coverage badge...')
    generateBadges(coveredProjects);
    commitAndPushChanges('chore: coverage badges [skip ci]');

    core.info(`Building message...`)
    const message = buildMessage(coveredProjects)

    const coverageThresholdMet = verifyCoverageThreshold(coveredProjects)
    const noDecreaseMet = verifyNoCoverageDecrease(coveredProjects)

    if (coverageThresholdMet && noDecreaseMet) {
      core.setOutput('message', message)
    } else {
      core.setFailed('Configured conditions were not met.')
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
