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
    core.debug(`Finding projects...`)
    const projects = await findProjects(null)
    core.debug(`Found ${projects.length} projects`)

    core.debug(`Parsing coverage...`)
    const coveredProjects = await Promise.all(projects.map(coverProject))

    core.debug(
      `${coveredProjects.filter(p => p.coverage).length} projects covered.`
    )

    core.debug(`Building message...`)
    const message = buildMessage(coveredProjects)

    const coverageThresholdMet = verifyCoverageThreshold(coveredProjects)
    const noDecreaseMet = verifyNoCoverageDecrease(coveredProjects)

    if (coverageThresholdMet && noDecreaseMet) {
      core.setFailed('Configured conditions were not met.')
    } else {
      core.setOutput('message', message)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
