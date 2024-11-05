import { createReadStream } from 'node:fs'
import lcovParser, { SectionSummary } from '@friedemannsommer/lcov-parser'
import { Project } from './finder'

export interface LineCoverage {
  hit: number
  found: number
  percentage: number
}

export interface CoveredProject extends Project {
  name: string
  description: string

  pubspecFile: string

  /**
   * Parsed coverage files for this project. If undefined, this project wasn't covered.
   */
  coverage: SectionSummary[] | undefined

  /**
   * A coverage file that was parsed before the current coverage file.
   * If this is undefined, assume this is the first run and don't generate diffs.
   * If this is null, assume it is zero coverage.
   */
  coverageBefore: SectionSummary[] | null | undefined
}

/**
 * Converts a project into a CoveredProject object by attempting to parse the coverage file
 * @param project the project for which the coverage should be calculated
 * @returns a CoveredProject object that contains the name, description and coverage of the project
 */
export async function coverProject(project: Project): Promise<CoveredProject> {
  return {
    name: project.name,
    description: project.description,
    coverageFile: project.coverageFile,
    pubspecFile: project.pubspecFile,
    coverage: await parseLcov(project),
    coverageBefore: undefined
  }
}

/**
 * Should be called once we are in "before" state. Parses coverage file and sets it as coverageBefore
 * @param project Project to parse
 * @returns Project including coverage before
 */
export async function parseLcovBefore(
  project: CoveredProject
): Promise<CoveredProject> {
  return {
    ...project,
    coverageBefore: await parseLcov(project)
  }
}

async function parseLcov(
  project: Project
): Promise<SectionSummary[] | undefined> {
  const file = project.coverageFile
  if (!file) {
    return undefined
  }

  return lcovParser({ from: createReadStream(file) })
}

export function getLineCoverage(lcov: SectionSummary[]): LineCoverage {
  let hit = 0
  let found = 0
  for (const entry of lcov) {
    hit += entry.lines.hit
    found += entry.lines.instrumented
  }
  if (!found) {
    return {
      hit,
      found,
      percentage: 0
    }
  }

  return {
    hit,
    found,
    percentage: (hit / found) * 100
  }
}

export function getProjectLineCoverage(
  project: CoveredProject
): LineCoverage | undefined {
  if (project.coverage === undefined) {
    return undefined
  }
  return getLineCoverage(project.coverage)
}

export function getProjectLineCoverageBefore(
  project: CoveredProject
): LineCoverage | undefined {
  if (project.coverageBefore === undefined) {
    return undefined
  }
  if (project.coverageBefore === null) {
    return { hit: 0, found: 0, percentage: 0 }
  }
  return getLineCoverage(project.coverageBefore)
}

export function getTotalPercentage(
  projects: CoveredProject[]
): LineCoverage | undefined {
  return getLineCoverage(getSectionSummaries(projects, 'coverage'))
}

export function getTotalPercentageBefore(
  projects: CoveredProject[]
): LineCoverage | undefined {
  if (projects.some(p => p.coverageBefore !== undefined)) {
    return getLineCoverage(getSectionSummaries(projects, 'coverageBefore'))
  }
  return undefined
}

function getSectionSummaries(
  projects: CoveredProject[],
  coverageKey: keyof Pick<CoveredProject, 'coverage' | 'coverageBefore'>
): SectionSummary[] {
  let summaries: SectionSummary[] = []
  for (const project of projects) {
    const sectionSummaries = project[coverageKey]
    if (!sectionSummaries) {
      continue
    }
    summaries = summaries.concat(sectionSummaries)
  }

  return summaries
}
