import { getInput } from '@actions/core'

type CoverageRule = 'none' | 'single' | 'total'

export class Config {
  static githubToken: string = getInput('GITHUB_TOKEN', { required: true })

  static upperCoverageThreshold: number = parseFloat(
    getInput('upper_threshold', { required: true })
  )

  static lowerCoverageThreshold: number = parseFloat(
    getInput('lower_threshold', { required: true })
  )

  static compareAgainstBase: boolean =
    getInput('compare_against_base', { required: true }) == 'true'

  static enforceCoverageThreshold: CoverageRule = this.parseCoverageRule(
    getInput('enforce_coverage_threshold', { required: true })
  )

  static enforceForbiddenDecrease: CoverageRule = this.parseCoverageRule(
    getInput('enforce_forbidden_decrease', { required: true })
  )

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
