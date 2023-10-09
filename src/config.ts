import { getInput } from '@actions/core'

type CoverageRule = 'none' | 'single' | 'total'

export class Config {
  static get githubToken(): string {
    return getInput('GITHUB_TOKEN', { required: true })
  }

  static get upperCoverageThreshold(): number {
    return parseFloat(getInput('upper_threshold'))
  }

  static get lowerCoverageThreshold(): number {
    return parseFloat(getInput('lower_threshold'))
  }

  static get compareAgainstBase(): boolean {
    return getInput('compare_against_base') === 'true'
  }

  static get enforceCoverageThreshold(): CoverageRule {
    return this.parseCoverageRule(
      getInput('enforce_coverage_threshold')
    )
  }

  static get enforceForbiddenDecrease(): CoverageRule {
    return this.parseCoverageRule(
      getInput('enforce_forbidden_decrease')
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
