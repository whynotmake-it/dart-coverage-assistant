import { getInput } from '@actions/core'

type CoverageRule = 'none' | 'single' | 'total'
type BadgeGenerationRule = 'none' | 'push' | 'pr'

export class Config {
  static get githubToken(): string {
    return getInput('GITHUB_TOKEN', { required: true })
  }

  static get githubHeadRef(): string {
    return getInput('GITHUB_HEAD_REF', { required: true })
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

  static get enforceThreshold(): CoverageRule {
    return this.parseCoverageRule(getInput('enforce_threshold'))
  }

  static get enforceForbiddenDecrease(): CoverageRule {
    return this.parseCoverageRule(getInput('enforce_forbidden_decrease'))
  }

  static get generateBadges(): BadgeGenerationRule {
    return this.parseBadgeGenerationRule(getInput('generate_badges'))
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
        throw new Error(`Unknown coverage setting '${rule}'`)
    }
  }

  private static parseBadgeGenerationRule(rule: string): BadgeGenerationRule {
    switch (rule) {
      case 'none':
      case 'false':
        return 'none'
      case 'pr':
      case 'pull_request':
        return 'pr'
      case 'push':
      case 'true':
        return 'push'
      default:
        throw new Error(`Unknown badge generation setting '${rule}'`)
    }
  }
}
