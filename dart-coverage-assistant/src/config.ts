import { getInput } from "@actions/core";
import { expect } from "@std/expect/expect";
import { assertSpyCall, returnsNext, stub } from "@std/testing/mock";

type CoverageRule = "none" | "single" | "total";

type BadgeGenerationRule = "none" | "push" | "pr";

const _internals = { getInput };

/**
 * The Config class provides static methods to retrieve configuration settings
 * from the environment or input parameters. These settings are used to control
 * various aspects of the dart-coverage-assistant tool.
 */
export class Config {
  /**
   * Retrieves the GitHub token from the input parameters.
   * @returns {string} The GitHub token.
   */
  static get githubToken(): string {
    return _internals.getInput("GITHUB_TOKEN", { required: true });
  }

  /**
   * Retrieves the GitHub head reference from the input parameters.
   * @returns {string} The GitHub head reference.
   */
  static get githubHeadRef(): string {
    return _internals.getInput("GITHUB_HEAD_REF", { required: true });
  }

  /**
   * Retrieves the upper coverage threshold from the input parameters.
   * @returns {number} The upper coverage threshold.
   */
  static get upperCoverageThreshold(): number {
    return parseFloat(_internals.getInput("upper_threshold"));
  }

  /**
   * Retrieves the lower coverage threshold from the input parameters.
   * @returns {number} The lower coverage threshold.
   */
  static get lowerCoverageThreshold(): number {
    return parseFloat(_internals.getInput("lower_threshold"));
  }

  /**
   * Retrieves the flag indicating whether to compare against the base branch from the input parameters.
   * @returns {boolean} True if comparison against the base branch is enabled, false otherwise.
   */
  static get compareAgainstBase(): boolean {
    return _internals.getInput("compare_against_base") === "true";
  }

  /**
   * Retrieves the coverage rule for enforcing thresholds from the input parameters.
   * @returns {CoverageRule} The coverage rule for enforcing thresholds.
   */
  static get enforceThreshold(): CoverageRule {
    return this.parseCoverageRule(
      _internals.getInput("enforce_threshold"),
    );
  }

  /**
   * Retrieves the coverage rule for enforcing forbidden decreases from the input parameters.
   * @returns {CoverageRule} The coverage rule for enforcing forbidden decreases.
   */
  static get enforceForbiddenDecrease(): CoverageRule {
    return this.parseCoverageRule(
      _internals.getInput("enforce_forbidden_decrease"),
    );
  }

  /**
   * Retrieves the badge generation rule from the input parameters.
   * @returns {BadgeGenerationRule} The badge generation rule.
   */
  static get generateBadges(): BadgeGenerationRule {
    return this.parseBadgeGenerationRule(
      _internals.getInput("generate_badges"),
    );
  }

  /**
   * Parses the coverage rule from a string value.
   * @param {string} rule - The string representation of the coverage rule.
   * @returns {CoverageRule} The parsed coverage rule.
   * @throws {Error} If the coverage rule is unknown.
   */
  private static parseCoverageRule(rule: string): CoverageRule {
    switch (rule) {
      case "none":
      case "false":
        return "none";
      case "single":
        return "single";
      case "total":
        return "total";
      default:
        throw new Error(`Unknown coverage setting '${rule}'`);
    }
  }

  /**
   * Parses the badge generation rule from a string value.
   * @param {string} rule - The string representation of the badge generation rule.
   * @returns {BadgeGenerationRule} The parsed badge generation rule.
   * @throws {Error} If the badge generation rule is unknown.
   */
  private static parseBadgeGenerationRule(rule: string): BadgeGenerationRule {
    switch (rule) {
      case "none":
      case "false":
        return "none";
      case "pr":
      case "pull_request":
        return "pr";
      case "push":
      case "true":
        return "push";
      default:
        throw new Error(`Unknown badge generation setting '${rule}'`);
    }
  }
}

Deno.test("enforceThreshold can parse correctly", () => {
  using getInputStub = stub(
    _internals,
    "getInput",
    returnsNext(["single", "false", "total", "none", "unknown"]),
  );
  expect(Config.enforceThreshold).toEqual("single");
  expect(Config.enforceThreshold).toEqual("none");
  expect(Config.enforceThreshold).toEqual("total");
  expect(Config.enforceThreshold).toEqual("none");
  expect(() => Config.enforceThreshold).toThrow(
    "Unknown coverage setting 'unknown'",
  );
  assertSpyCall(getInputStub, 0, { args: ["enforce_threshold"] });
});

Deno.test("enforceForbiddenDecrease can parse correctly", () => {
  using getInputStub = stub(
    _internals,
    "getInput",
    returnsNext(["single", "false", "total", "none", "unknown"]),
  );
  expect(Config.enforceForbiddenDecrease).toEqual("single");
  expect(Config.enforceForbiddenDecrease).toEqual("none");
  expect(Config.enforceForbiddenDecrease).toEqual("total");
  expect(Config.enforceForbiddenDecrease).toEqual("none");
  expect(() => Config.enforceForbiddenDecrease).toThrow(
    "Unknown coverage setting 'unknown'",
  );
  assertSpyCall(getInputStub, 0, {
    args: ["enforce_forbidden_decrease"],
  });
});

Deno.test("generateBadges can parse correctly", () => {
  using getInputStub = stub(
    _internals,
    "getInput",
    returnsNext(["pr", "false", "push", "none", "unknown"]),
  );
  expect(Config.generateBadges).toEqual("pr");
  expect(Config.generateBadges).toEqual("none");
  expect(Config.generateBadges).toEqual("push");
  expect(Config.generateBadges).toEqual("none");
  expect(() => Config.generateBadges).toThrow(
    "Unknown badge generation setting 'unknown'",
  );
  assertSpyCall(getInputStub, 0, { args: ["generate_badges"] });
});
