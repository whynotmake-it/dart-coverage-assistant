import parse from 'lcov-parse';
import * as fs from 'fs';
import { Project } from './finder';

export interface CoveredProject {
    name: string;
    description: string;

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
export async function coverProject(project: Project): Promise<CoveredProject> {
    return {
        name: project.name,
        description: project.description,
        coverage: await parseLcov(project),
        coverageBefore: undefined,
    };
}


async function parseLcov(project: Project): Promise<parse.LcovFile[] | undefined> {
    if (!project.coverageFile) {
        return undefined;
    }

    return new Promise((resolve, reject) => {
        parse(project.coverageFile!, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

export function getLcovPercentage(lcov: parse.LcovFile[]): number {
    let hit = 0;
    let found = 0;
    for (const entry of lcov) {
        hit += entry.lines.hit;
        found += entry.lines.found;
    }

    return (hit / found) * 100;
}

export function getProjectPercentage(project: CoveredProject): number | undefined {
    if (project.coverage === undefined) {
        return undefined;
    }
    return getLcovPercentage(project.coverage);
}

export function getTotalPercentage(projects: CoveredProject[]): number | undefined {
    const coverages = projects.map(getProjectPercentage).filter((c) => c !== undefined) as number[];
    if (coverages.length === 0) {
        return undefined;
    }
    return coverages.reduce((a, b) => a + b) / coverages.length;
}
