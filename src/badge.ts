import * as fs from 'fs'
import { Config } from './config'
import {
  CoveredProject,
  getProjectPercentage,
  getTotalPercentage
} from './lcov'

export async function generateBadges(
  projects: CoveredProject[]
): Promise<void> {
  for (const project of projects.filter(p => p.coverage)) {
    const percentage = getProjectPercentage(project)
    if (percentage === undefined) {
      continue
    }
    const svg = await buildSvg(
      project.name,
      Config.upperCoverageThreshold,
      Config.lowerCoverageThreshold,
      percentage
    )

    const path = project.pubspecFile.split('/').slice(0, -1).join('/')
    // write svg to file
    fs.writeFileSync(`${path}/coverage.svg`, svg)
  }
  const totalPercentage = getTotalPercentage(projects)
  if (totalPercentage === undefined) {
    return
  }
  const svg = await buildSvg(
    'Test Coverage',
    Config.upperCoverageThreshold,
    Config.lowerCoverageThreshold,
    totalPercentage
  )
  fs.writeFileSync(`./coverage-total.svg`, svg)
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
