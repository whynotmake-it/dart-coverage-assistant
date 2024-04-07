type CoverageRule = 'none' | 'single' | 'total';
type BadgeGenerationRule = 'none' | 'push' | 'pr';
export declare class Config {
    static get githubToken(): string;
    static get githubHeadRef(): string;
    static get upperCoverageThreshold(): number;
    static get lowerCoverageThreshold(): number;
    static get compareAgainstBase(): boolean;
    static get enforceThreshold(): CoverageRule;
    static get enforceForbiddenDecrease(): CoverageRule;
    static get generateBadges(): BadgeGenerationRule;
    private static parseCoverageRule;
    private static parseBadgeGenerationRule;
}
export {};
