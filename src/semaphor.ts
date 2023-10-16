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
        `Coverage threshold not met for ${failedProjects.length} projects`
      )
      return false
    }
  } else if (Config.enforceThreshold === 'total') {
    const percentage = getTotalPercentage(projects)
    if (
      percentage === undefined ||
      percentage < Config.lowerCoverageThreshold
    ) {
      core.error(`Coverage threshold not met for total coverage`)
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
    const failed = projects.filter(p => {
      const percentage = getProjectPercentage(p)
      const before = getProjectPercentageBefore(p)
      return (
        percentage !== undefined && before !== undefined && percentage < before
      )
    })
    if (failed.length) {
      core.error(`Coverage decrease detected for ${failed.length} projects`)
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
