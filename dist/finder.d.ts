export interface Project {
    name: string;
    description: string;
    pubspecFile: string;
    coverageFile: string | null;
}
/**
 * Finds all projects in the current directory
 * @param excludePattern Glob patterns of pubspec files that will be disregarded, seperated by newlines
 */
export declare function findProjects(excludePattern: string | null): Promise<Project[]>;
