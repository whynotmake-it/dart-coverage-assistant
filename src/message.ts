import parse, { LcovFile } from 'lcov-parse'
import { CoveredProject, getLcovPercentage, getProjectPercentage } from './lcov'
import { Config } from './config'

export function buildMessage(projects: CoveredProject[]): string {
  var md = ''
  md += '# Coverage Report\n'
  for (const project of projects) {
    md += buildTable(project) + '\n'
  }
  return md
}

function buildTable(project: CoveredProject): string {
  var md = ''
  md += buildHeader(project) + '\n'
  md += buildBody(project) + '\n'
  return md
}

function buildHeader(project: CoveredProject): string {
  const percentage = project.coverage
    ? getProjectPercentage(project)
    : undefined
  const percentageCell = percentage
    ? `<td>${percentage.toFixed(2)}%</td>`
    : '<td>⚠️</td>'
  const diff = getDiff(project)
  var diffCell: string
  if (diff === undefined) {
    diffCell = '<td>-</td>'
  } else if (diff === 0) {
    diffCell = `<td>➡️ ${diff.toFixed(2)}%</td>`
  } else if (diff > 0) {
    diffCell = `<td>⬆️ +${diff.toFixed(2)}%</td>`
  } else {
    diffCell = `<td>⬇️ ${diff.toFixed(2)}%</td>`
  }

  const badgeCell = percentage
    ? `<td>${buildBadgetableMd(
        project.name,
        Config.upperCoverageThreshold,
        Config.lowerCoverageThreshold,
        percentage
      )}</td>`
    : '<td>-</td>'

  return `<table>\n
    <thead>\n
        <tr>\n
            <th>${project.name}</th>\n
            ${percentageCell}\n
            ${diffCell}\n
            ${badgeCell}\n
        </tr>\n
    </thead>\n
    </table>`
}

function buildBody(project: CoveredProject): string {
  if (project.coverage === undefined) {
    return ''
  }
  var tableMd = ''
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
    tableMd += '| --- | --- | --- |\n'
    for (const file of folders[folder]) {
      const name = file.file.split('/').slice(-1)[0]
      tableMd += `| ${name} | ${getLcovPercentage([file])} | ${
        file.lines.details.length
      } |\n`
    }
    tableMd += '| --- | --- | --- |\n'
  }

  tableMd += '\n'

  return `<details>\n
        <summary>Coverage Details</summary>\n
        \n
        ${tableMd}\n
    </details>`
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
