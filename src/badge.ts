import { Config } from './config';
import { CoveredProject, getProjectPercentage, getTotalPercentage } from './lcov';
import * as fs from 'fs';

export async function generateBadges(projects: CoveredProject[]): Promise<void> {
    const svgs: string[] = [];
    for (const project of projects.filter(p => p.coverage)) {
        const percentage = getProjectPercentage(project);
        if (percentage === undefined) {
            continue;
        }
        const svg = await buildSvg(
            project.name,
            Config.upperCoverageThreshold,
            Config.lowerCoverageThreshold,
            percentage,
        );

        const path = project.pubspecFile.split('/').slice(0, -1).join('/');
        // write svg to file
        fs.writeFileSync(`${path}/coverage-badge.svg`, svg);
    }
    const totalPercentageg = getTotalPercentage(projects);
    if (totalPercentageg === undefined) {
        return;
    }
    const svg = await buildSvg(
        "total coverage",
        Config.upperCoverageThreshold,
        Config.lowerCoverageThreshold,
        totalPercentageg,
    );
    fs.writeFileSync(`./coverage-badge-total.svg`, svg);

}

async function buildSvg(
    name: string,
    upper: number,
    lower: number,
    percentage: number
): Promise<string> {
    // get url
    const url = buildBadgeUrl(name, upper, lower, percentage);

    const fetch = await import('node-fetch');
    // fetch url
    const response = await fetch.default(url);

    // get svg
    const svg = await response.text();

    return svg;
}


export function buildBadgeUrl(
    name: string,
    upper: number,
    lower: number,
    percentage: number
): string {
    const percentageString = percentage.toFixed(2) + '%'
    const color =
        percentage >= upper
            ? 'success'
            : percentage >= lower
                ? 'important'
                : 'critical'
    const url = `https://img.shields.io/badge/${name}-${percentageString}-${color}`
    return encodeURI(url)
}
