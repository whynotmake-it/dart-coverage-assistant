import * as core from '@actions/core'
import { findProjects } from './finder'
import { coverProject } from './lcov'
import { buildMessage } from './message'
import { verifyCoverageThreshold, verifyNoCoverageDecrease } from './semaphor'

/**
 * The main function for the action.
 * @returns {Promise<string>} Returns the message that can be used as a code coverage report
 */
export async function run(): Promise<void> {
  try {
    core.info(`Finding projects...`)
    const projects = await findProjects(null)
    core.info(`Found ${projects.length} projects`)

    core.info(`Parsing coverage...`)
    const coveredProjects = await Promise.all(projects.map(coverProject))

    core.info(
      `${coveredProjects.filter(p => p.coverage).length} projects covered.`
    )

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
