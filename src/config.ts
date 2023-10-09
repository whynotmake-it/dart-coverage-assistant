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
    //TODO
    return false
  }

  static get enforceThreshold(): CoverageRule {
    return this.parseCoverageRule(getInput('enforce_threshold'))
  }

  static get enforceForbiddenDecrease(): CoverageRule {
    //TODO
    return 'none'
  }

  static get generateBadges(): boolean {
    return getInput('generate_badges') === 'true'
  }

  private static parseCoverageRule(rule: string): CoverageRule {
    switch (rule) {
      case 'none':
      case 'false':
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
