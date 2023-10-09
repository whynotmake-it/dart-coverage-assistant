import { LcovFile } from 'lcov-parse'
import { CoveredProject, getLcovPercentage, getProjectPercentage } from './lcov'
import { Config } from './config'

export function buildMessage(projects: CoveredProject[]): string {
  let md = ''
  md += '# Coverage Report\n\n'
  for (const project of projects.filter(p => p.coverage)) {
    md += buildTable(project) + '\n'
  }
  return md
}

function buildTable(project: CoveredProject): string {
  let md = ''
  md += buildHeader(project) + '\n'
  md += buildBody(project) + '\n'
  return md
}

function buildHeader(project: CoveredProject): string {
  const percentage = project.coverage
    ? getProjectPercentage(project)
    : undefined
  const percentageCell = percentage ? `${percentage.toFixed(2)}%` : '⚠️'
  const diff = getDiff(project)
  let diffCell: string
  if (diff === undefined) {
    diffCell = '-'
  } else if (diff === 0) {
    diffCell = `➡️ ${diff.toFixed(2)}%`
  } else if (diff > 0) {
    diffCell = `⬆️ +${diff.toFixed(2)}%`
  } else {
    diffCell = `⬇️ ${diff.toFixed(2)}%`
  }

  const badgeCell = percentage
    ? `${buildBadgetableMd(
        project.name,
        Config.upperCoverageThreshold,
        Config.lowerCoverageThreshold,
        percentage
      )}`
    : ''

  return `## ${project.name} ${badgeCell}}
      > ${project.description}

      | Coverage | Diff |
      | --- | --- |
      | ${percentageCell} | ${diffCell} |
  `
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
    const parts = file.file.split('/')
    const folder = parts.slice(0, -1).join('/')
    folders[folder] = folders[folder] || []
    folders[folder].push(file)
  }

  // Add all folders to the table
  for (const folder of Object.keys(folders).sort()) {
    tableMd += `| **${folder}** |   |   |\n`
    for (const file of folders[folder]) {
      const name = file.file.split('/').slice(-1)[0]
      tableMd += `| ${name} | ${getLcovPercentage([file])} | ${
        file.lines.details.length
      } |\n`
    }
    tableMd += '| --- | --- | --- |\n'
  }

  let md = '<details>\n'
  md += `<summary>Coverage Details ${project.name}</summary>\n`
  md += '\n'
  md += tableMd
  md += '\n'
  md += '</details>'
  return md
}

function getDiff(project: CoveredProject): number | undefined {
  if (project.coverageBefore === undefined || !project.coverage) {
    return undefined
  }
  const current = getLcovPercentage(project.coverage)
  const before =
    project.coverageBefore === null
      ? 0
      : getLcovPercentage(project.coverageBefore)
  return current - before
}

function buildBadgetableMd(
  name: string,
  upper: number,
  lower: number,
  percentage: number
): string {
  const percentageString = percentage.toFixed(2) + '%'
  const alt =
    percentage >= upper ? 'pass' : percentage >= lower ? 'warning' : 'fail'
  const color =
    percentage >= upper
      ? 'success'
      : percentage >= lower
      ? 'important'
      : 'critical'
  const url = `https://img.shields.io/badge/${name}-${percentageString}-${color}`
  return `![${alt}](${url} "${alt}")`
}
