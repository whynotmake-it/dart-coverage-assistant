import { LcovFile } from 'lcov-parse'
import {
  CoveredProject,
  getLineCoverage,
  getProjectLineCoverage,
  getProjectLineCoverageBefore,
  getTotalPercentage,
  getTotalPercentageBefore
} from './lcov'
import { Config } from './config'
import { buildBadgeUrl } from './badge'

/**
 * Builds a markdown message containing the coverage report.
 * @param projects The projects to include in the report.
 * @param sha The sha of the commit.
 * @returns The markdown message.
 */
export function buildMessage(projects: CoveredProject[], sha: string): string {
  if (projects.length === 0) {
    return ''
  }
  const shaShort = sha.slice(0, 8)
  let md = ''
  md += '# Coverage Report\n'
  md += `This is an automatic coverage report for ${shaShort}, proudly generated by [Dart Coverage Assistant](https://github.com/whynotmake-it/dart-coverage-assistant) 🎯🧪.\n`
  md += '\n'
  if (projects.length > 1) {
    md += buildTotalTable(projects) + '\n'
  }

  for (const project of projects) {
    md += buildForProject(project) + '\n'
  }
  return md
}

function buildTotalTable(projects: CoveredProject[]): string {
  let md = ''
  const totalLineCoverage = getTotalPercentage(projects)
  if (totalLineCoverage !== undefined) {
    const badge = buildBadge(
      Config.upperCoverageThreshold,
      Config.lowerCoverageThreshold,
      totalLineCoverage.percentage
    )
    md += `## Monorepo coverage\n`
    md += `This repository contains ${projects.length} Dart projects. This is is the total coverage across all of them:\n`
    md += '\n'
    md += `${badge}    ${buildDiffString(getTotalDiff(projects))}\n`
  }
  return md
}

function buildForProject(project: CoveredProject): string {
  let md = ''
  md += buildHeader(project) + '\n'
  md += '\n'
  md += buildBody(project) + '\n'
  return md
}

function buildHeader(project: CoveredProject): string {
  const lineCoverage = project.coverage
    ? getProjectLineCoverage(project)
    : undefined
  const diff = buildDiffString(getDiff(project))

  const badgeCell = buildBadge(
    Config.upperCoverageThreshold,
    Config.lowerCoverageThreshold,
    lineCoverage?.percentage ?? 0,
    project.name
  )

  let md = `## \`${project.name}\`\n`
  md += `${project.description}\n`
  md += '\n'
  md += `${badgeCell}    ${diff}\n`
  return md
}

function buildBody(project: CoveredProject): string {
  if (project.coverage === undefined) {
    return ''
  }
  let tableMd = ''
  tableMd += '| File | Line Percentage | Line Count |\n'
  tableMd += '| --- | --- | --- |\n'
  const folders: Record<string, LcovFile[]> = {}

  // Group files by folder
  for (const file of project.coverage) {
    const pubspecPath = project.pubspecFile.split('/').slice(0, -1).join('/')
    const folder = file.file
      .split('/')
      .slice(0, -1)
      .join('/')
      .replace(pubspecPath, '')
    folders[folder] = folders[folder] || []
    folders[folder].push(file)
  }

  // Add all folders to the table
  for (const folder of Object.keys(folders).sort()) {
    tableMd += `| **${folder}** |   |   |\n`
    for (const file of folders[folder]) {
      const name = file.file.split('/').slice(-1)[0]
      tableMd += `| ${name} | ${getLineCoverage([file]).percentage.toFixed(
        2
      )} | ${file.lines.details.length} |\n`
    }
  }

  let md = '<details>\n'
  md += `<summary>Coverage Details for <strong>${project.name}</strong></summary>\n`
  md += '\n'
  md += tableMd
  md += '\n'
  md += '</details>'
  return md
}

function buildDiffString(diff: number | undefined): string {
  if (diff === undefined) {
    return '-'
  }
  if (diff === 0) {
    return `➡️ ${diff.toFixed(2)}%`
  } else if (diff > 0) {
    return `⬆️ +${diff.toFixed(2)}%`
  } else {
    return `⬇️ ${diff.toFixed(2)}%`
  }
}

function getDiff(project: CoveredProject): number | undefined {
  if (project.coverageBefore === undefined || !project.coverage) {
    return undefined
  }
  const current = getProjectLineCoverage(project)
  const before = getProjectLineCoverageBefore(project)
  if (current === undefined || before === undefined) {
    return undefined
  }
  return current.percentage - before.percentage
}

function getTotalDiff(projects: CoveredProject[]): number | undefined {
  const current = getTotalPercentage(projects)
  const before = getTotalPercentageBefore(projects)
  if (current === undefined || before === undefined) {
    return undefined
  }
  return current.percentage - before.percentage
}

function buildBadge(
  upper: number,
  lower: number,
  percentage: number,
  name?: string
): string {
  const alt =
    percentage >= upper ? 'pass' : percentage >= lower ? 'warning' : 'fail'
  const url = buildBadgeUrl(name, upper, lower, percentage)
  return `![${percentage}% - ${alt}](${url})`
}
