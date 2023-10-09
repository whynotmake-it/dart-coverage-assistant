import { getInput } from '@actions/core'

type CoverageRule = 'none' | 'single' | 'total'

export class Config {
  static get githubToken(): string {
    return getInput('GITHUB_TOKEN', { required: true })
  }

  static get upperCoverageThreshold(): number {
    return parseFloat(getInput('upper_threshold', { required: true }))
  }

  static get lowerCoverageThreshold(): number {
    return parseFloat(getInput('lower_threshold', { required: true }))
  }

  static get compareAgainstBase(): boolean {
    return getInput('compare_against_base', { required: true }) === 'true'
  }

  static get enforceCoverageThreshold(): CoverageRule {
    return this.parseCoverageRule(
      getInput('enforce_coverage_threshold', { required: true })
    )
  }

  static get enforceForbiddenDecrease(): CoverageRule {
    return this.parseCoverageRule(
      getInput('enforce_forbidden_decrease', { required: true })
    )
  }

  private static parseCoverageRule(rule: string): CoverageRule {
    switch (rule) {
      case 'none':
        return 'none'
      case 'single':
        return 'single'
      case 'total':
        return 'total'
      default:
        throw new Error(`Unknown coverage rule '${rule}'`)
    }
  }
}
