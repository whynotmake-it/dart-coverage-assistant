import { Config } from './config'
import {
  CoveredProject,
  getProjectPercentage,
  getProjectPercentageBefore,
  getTotalPercentage,
  getTotalPercentageBefore
} from './lcov'
import * as core from '@actions/core'

export function verifyCoverageThreshold(projects: CoveredProject[]): boolean {
  if (Config.enforceThreshold === 'none') {
    return true
  } else if (Config.enforceThreshold === 'single') {
    const failedProjects = projects.filter(p => {
      const percentage = getProjectPercentage(p)
      return (
        percentage === undefined || percentage < Config.lowerCoverageThreshold
      )
    })
    if (failedProjects.length) {
      core.error(
        `Coverage threshold (${Config.lowerCoverageThreshold}%) not met for ${failedProjects.length} projects:`
      )
      for (const failed of failedProjects) {
        core.error(`${failed.name} - ${getProjectPercentage(failed)}%`)
      }
      return false
    }
  } else if (Config.enforceThreshold === 'total') {
    const percentage = getTotalPercentage(projects)
    if (percentage === undefined) {
      core.error(
        `Total coverage threshold of ${Config.lowerCoverageThreshold}% not met.`
      )
      return false
    } else if (percentage < Config.lowerCoverageThreshold) {
      core.error(
        `Total coverage of ${percentage.toFixed(
          2
        )}% does not meet threshold of ${Config.lowerCoverageThreshold}%`
      )
      return false
    }
  }
  return true
}

export function verifyNoCoverageDecrease(projects: CoveredProject[]): boolean {
  projects
  if (Config.enforceForbiddenDecrease === 'none') {
    return true
  } else if (Config.enforceForbiddenDecrease === 'single') {
    const failedProjects = projects.filter(p => {
      const percentage = getProjectPercentage(p)
      const before = getProjectPercentageBefore(p)
      return (
        percentage !== undefined && before !== undefined && percentage < before
      )
    })
    if (failedProjects.length) {
      core.error(
        `Coverage decrease detected for ${failedProjects.length} projects:`
      )
      for (const failed of failedProjects) {
        core.error(
          `${failed.name} - ${getProjectPercentageBefore(
            failed
          )?.toFixed()}% -> ${getProjectPercentage(failed)?.toFixed(2)}%`
        )
      }
      return false
    }
  } else if (Config.enforceForbiddenDecrease === 'total') {
    const total = getTotalPercentage(projects)
    const totalBefore = getTotalPercentageBefore(projects)
    if (
      total !== undefined &&
      totalBefore !== undefined &&
      total < totalBefore
    ) {
      core.error(
        `Total coverage decreased by ${(totalBefore - total).toFixed(2)}%`
      )
      return false
    }
  }
  return true
}
