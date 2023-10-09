import { Config } from './config'
import {
  CoveredProject,
  getProjectPercentage,
  getTotalPercentage
} from './lcov'
import * as core from '@actions/core'

export function verifyCoverageThreshold(projects: CoveredProject[]): boolean {
  if (Config.enforceThreshold === 'none') {
    return true
  }
  if (Config.enforceThreshold === 'single') {
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
  }
  if (Config.enforceThreshold === 'total') {
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
  // TODO
  projects
  if (Config.enforceForbiddenDecrease === 'none') {
    return true
  }
  return true
}
