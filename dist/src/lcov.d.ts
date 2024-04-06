import parse from 'lcov-parse';
import { Project } from './finder';
export interface LineCoverage {
    hit: number;
    found: number;
    percentage: number;
}
export interface CoveredProject extends Project {
    name: string;
    description: string;
    pubspecFile: string;
    /**
     * Parsed coverage files for this project. If undefined, this project wasn't covered.
     */
    coverage: parse.LcovFile[] | undefined;
    /**
     * A coverage file that was parsed before the current coverage file.
     * If this is undefined, assume this is the first run and don't generate diffs.
     * If this is null, assume it is zero coverage.
     */
    coverageBefore: parse.LcovFile[] | null | undefined;
}
/**
 * Converts a project into a CoveredProject object by attempting to parse the coverage file
 * @param project the project for which the coverage should be calculated
 * @returns a CoveredProject object that contains the name, description and coverage of the project
 */
export declare function coverProject(project: Project): Promise<CoveredProject>;
/**
 * Should be called once we are in "before" state. Parses coverage file and sets it as coverageBefore
 * @param project Project to parse
 * @returns Project including coverage before
 */
export declare function parseLcovBefore(project: CoveredProject): Promise<CoveredProject>;
export declare function getLineCoverage(lcov: parse.LcovFile[]): LineCoverage;
export declare function getProjectLineCoverage(project: CoveredProject): LineCoverage | undefined;
export declare function getProjectLineCoverageBefore(project: CoveredProject): LineCoverage | undefined;
export declare function getTotalPercentage(projects: CoveredProject[]): LineCoverage | undefined;
export declare function getTotalPercentageBefore(projects: CoveredProject[]): LineCoverage | undefined;
