import * as glob from "@actions/glob";
import { expect } from "@std/expect/expect";
import { returnsNext, stub } from "@std/testing/mock";

/**
 * Represents a Dart project that is found in the current directory
 */
export interface Project {
    name: string;
    description: string;
    pubspecFile: string;
    coverageFile: string | null;
}

function createGlobber(pattern: string): Promise<glob.Globber> {
    return glob.create(pattern);
}

function readFileContents(path: string): string {
    const file = Deno.readFileSync(path);
    return new TextDecoder("utf-8").decode(file);
}

const _internals = { createGlobber, readFileContents };

/**
 * Finds all projects in the current directory
 * @param excludePattern Glob patterns of pubspec files that will be disregarded, seperated by newlines
 */
export async function findProjects(
    excludePattern?: string,
): Promise<Project[]> {
    const excludes = excludePattern
        ?.split("\n")
        .map((p) => `!${p}`)
        ?.join("\n") ?? "";

    // Find all pubspec.yaml files in directory
    const globber = await _internals.createGlobber(
        `**/pubspec.yaml\n${excludes}`,
    );
    const results = await globber.glob();
    const files = results.filter((f) => Deno.lstatSync(f).isFile);

    // Sort files by depth and then alphabetically
    files.sort((a, b) => {
        const aDepth = a.split("/").length;
        const bDepth = b.split("/").length;
        if (aDepth === bDepth) {
            return a.localeCompare(b);
        }
        return aDepth - bDepth;
    });

    const projects: Project[] = [];
    for (const file of files) {
        const project = getProject(file);
        if (project) {
            projects.push(project);
        }
    }
    return projects;
}

/**
 * Returns the project that is described in the pubspec.yaml file
 * @param file The pubspec.yaml of this file
 */
function getProject(path: string): Project | null {
    // Read file in lines
    const lines = _internals.readFileContents(path).split("\n");

    // Find name
    const name = lines
        .find((l) => l.startsWith("name:"))
        ?.split(":")[1]
        ?.trim();

    // Find description
    const description = lines
        .find((l) => l.startsWith("description:"))
        ?.split(":")[1]
        ?.trim();

    // Check if project contains coverage
    const parentDirectory = path.split("/").slice(0, -1).join("/");
    const coverageFile = `${parentDirectory}/coverage/lcov.info`;

    try {
        Deno.lstatSync(coverageFile);
        return {
            name: name!,
            description: description ?? "",
            pubspecFile: path,
            coverageFile: coverageFile,
        };
    } catch (_) {
        return {
            name: name!,
            description: description!,
            pubspecFile: path,
            coverageFile: null,
        };
    }
}

Deno.test("findProjects", async (t) => {
    // deno-lint-ignore no-explicit-any
    stub(Deno, "lstatSync", () => ({ isFile: true } as any));
    const mockGlobber = {} as glob.Globber;
    stub(
        _internals,
        "createGlobber",
        () => Promise.resolve(mockGlobber),
    );

    await t.step(
        "findProjects can find a project if pubspec is read",
        async () => {
            using _ = stub(
                mockGlobber,
                "glob",
                () => Promise.resolve(["./pubspec.yaml"]),
            );
            using __ = stub(
                _internals,
                "readFileContents",
                returnsNext(["name: test\ndescription: test\n"]),
            );

            const projects = await findProjects();
            expect(projects).toHaveLength(1);
            expect(projects[0]).toEqual({
                name: "test",
                description: "test",
                pubspecFile: "./pubspec.yaml",
                coverageFile: "./coverage/lcov.info",
            });
        },
    );

    await t.step(
        "can find multiple projects in different directories",
        async () => {
            using _ = stub(
                mockGlobber,
                "glob",
                () => Promise.resolve(["./pubspec.yaml", "./sub/pubspec.yaml"]),
            );

            using __ = stub(
                _internals,
                "readFileContents",
                returnsNext([
                    "name: test\ndescription: test\n",
                    "name: sub\ndescription: sub\n",
                ]),
            );

            const projects = await findProjects();
            expect(projects).toHaveLength(2);
            expect(projects[0]).toEqual({
                name: "test",
                description: "test",
                pubspecFile: "./pubspec.yaml",
                coverageFile: "./coverage/lcov.info",
            });
            expect(projects[1]).toEqual({
                name: "sub",
                description: "sub",
                pubspecFile: "./sub/pubspec.yaml",
                coverageFile: "./sub/coverage/lcov.info",
            });
        },
    );
    await t.step(
        "sorts projects by depth and then alphabetically",
        async () => {
            stub(
                mockGlobber,
                "glob",
                () =>
                    Promise.resolve([
                        "./sub/pubspec.yaml",
                        "./aub/pubspec.yaml",
                        "./pubspec.yaml",
                        "./sub/sub/pubspec.yaml",
                    ]),
            );

            stub(
                _internals,
                "readFileContents",
                returnsNext([
                    "name: test\ndescription: test\n",
                    "name: aub\ndescription: aub\n",
                    "name: sub\ndescription: sub\n",
                    "name: subsub\ndescription: subsub\n",
                ]),
            );

            const projects = await findProjects();

            expect(projects).toEqual([
                {
                    name: "test",
                    description: "test",
                    pubspecFile: "./pubspec.yaml",
                    coverageFile: "./coverage/lcov.info",
                },
                {
                    name: "aub",
                    description: "aub",
                    pubspecFile: "./aub/pubspec.yaml",
                    coverageFile: "./aub/coverage/lcov.info",
                },
                {
                    name: "sub",
                    description: "sub",
                    pubspecFile: "./sub/pubspec.yaml",
                    coverageFile: "./sub/coverage/lcov.info",
                },
                {
                    name: "subsub",
                    description: "subsub",
                    pubspecFile: "./sub/sub/pubspec.yaml",
                    coverageFile: "./sub/sub/coverage/lcov.info",
                },
            ]);
        },
    );
});
