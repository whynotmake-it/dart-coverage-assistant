import * as fs from 'fs'
import * as glob from '@actions/glob'

export interface Project {
  name: string
  description: string
  coverageFile: string | null
}

/**
 * Finds all projects in the current directory
 * @param excludePattern Glob patterns of pubspec files that will be disregarded, seperated by newlines
 */
export async function findProjects(
  excludePattern: string | null
): Promise<Project[]> {
  const excludes =
    excludePattern
      ?.split('\n')
      .map(p => `!${p}`)
      ?.join('\n') ?? ''

  // Find all pubspec.yaml files in directory
  const globber = await glob.create(`**/pubspec.yaml\n${excludes}`)
  const results = await globber.glob()
  const files = results.filter(f => fs.lstatSync(f).isFile())

  const projects: Project[] = []
  for (const file of files) {
    const project = getProject(file)
    if (project) {
      projects.push(project)
    }
  }
  return projects
}

/**
 * Returns the project that is described in the pubspec.yaml file
 * @param file The pubspec.yaml of this file
 */
function getProject(file: string): Project | null {
  // Read file in lines
  const lines = fs.readFileSync(file, 'utf8').split('\n')

  // Find name
  const name = lines
    .find(l => l.startsWith('name:'))
    ?.split(':')[1]
    ?.trim()

  // Find description
  const description = lines
    .find(l => l.startsWith('description:'))
    ?.split(':')[1]
    ?.trim()

  // Check if project contains coverage
  const parentDirectory = file.split('/').slice(0, -1).join('/')
  const coverageFile = `${parentDirectory}/coverage/lcov.info`
  const containsCoverage = fs.existsSync(coverageFile)

  if (name && description) {
    return {
      name,
      description,
      coverageFile: containsCoverage ? coverageFile : null
    }
  }
  return null
}
