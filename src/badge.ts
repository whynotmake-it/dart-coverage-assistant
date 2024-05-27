import * as fs from 'fs'
import { Config } from './config'
import {
  CoveredProject,
  getProjectLineCoverage as getProjectLineCoverage,
  getTotalPercentage as getTotalLineCoverage
} from './lcov'

export async function generateBadges(
  projects: CoveredProject[]
): Promise<void> {
  for (const project of projects.filter(p => p.coverage)) {
    const lineCoverage = getProjectLineCoverage(project)
    if (lineCoverage === undefined) {
      continue
    }
    const svg = await buildSvg(
      `${project.name} Coverage`,
      Config.upperCoverageThreshold,
      Config.lowerCoverageThreshold,
      lineCoverage.percentage
    )

    const path = project.pubspecFile.split('/').slice(0, -1).join('/')
    // write svg to file
    fs.writeFileSync(`${path}/coverage.svg`, svg)
  }
  if (projects.length > 1) {
    const totalLineCoverage = getTotalLineCoverage(projects)
    if (totalLineCoverage === undefined) {
      return
    }
    const svg = await buildSvg(
      'Monorepo Coverage',
      Config.upperCoverageThreshold,
      Config.lowerCoverageThreshold,
      totalLineCoverage.percentage
    )
    fs.writeFileSync(`./coverage-total.svg`, svg)
  }
}

export async function buildSvg(
  name: string,
  upper: number,
  lower: number,
  percentage: number
): Promise<string> {
  // get url
  const url = buildBadgeUrl(name, upper, lower, percentage)

  const res = await fetch(url)
  return res.text()
}

export function buildBadgeUrl(
  name: string | undefined,
  upper: number,
  lower: number,
  percentage: number
): string {
  let color = ''
  if (percentage >= upper) {
    color = 'success'
  } else if (percentage >= lower) {
    color = 'important'
  } else {
    color = 'critical'
  }
  const firstHalf = name ? `${name}-` : ''
  const secondHalf = `${percentage.toFixed(2)}%`

  return encodeURI(
    `http://img.shields.io/badge/${firstHalf}${secondHalf}-${color}`
  )
}
