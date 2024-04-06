import { CoveredProject } from './lcov';
export declare function generateBadges(projects: CoveredProject[]): Promise<void>;
export declare function buildSvg(name: string, upper: number, lower: number, percentage: number): Promise<string>;
export declare function buildBadgeUrl(name: string | undefined, upper: number, lower: number, percentage: number): string;
