import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import simpleGit from 'simple-git';
import { boolean, object, optional, parse, record, string, type InferOutput } from 'valibot';

import diffMap from './diffMap.ts';

const packageJSONSchema = object({
  dependencies: optional(record(string(), string())),
  devDependencies: optional(record(string(), string())),
  private: optional(boolean(), false)
});

export default async function diffDependencies(relativePathToProjectRoot: string): Promise<
  Readonly<{
    dependencies: ReadonlyMap<string, string>;
    devDependencies: ReadonlyMap<string, string>;
    private: boolean;
  }>
> {
  const projectRoot = process.cwd();
  const packageJSONPath = resolve(projectRoot, relativePathToProjectRoot);

  let headPackageJSON: InferOutput<typeof packageJSONSchema>;

  try {
    headPackageJSON = parse(
      packageJSONSchema,
      JSON.parse(await simpleGit().show(`origin/main:${relative(projectRoot, packageJSONPath)}`))
    );
  } catch {
    headPackageJSON = { private: true };
  }

  const packageJSON = parse(packageJSONSchema, JSON.parse(await readFile(packageJSONPath, 'utf-8')));

  const headDependencies = new Map(Object.entries(headPackageJSON.dependencies || {}));
  const headDevDependencies = new Map(Object.entries(headPackageJSON.devDependencies || {}));

  const dependencies = new Map(Object.entries(packageJSON.dependencies || {}));
  const devDependencies = new Map(Object.entries(packageJSON.devDependencies || {}));

  const bumpedDependencies = Object.freeze(
    new Map(
      Array.from(diffMap(headDependencies, dependencies).entries()).map(([key, value]) => [
        key,
        value.replace(/^\^/u, '')
      ])
    )
  );

  const bumpedDevDependencies = Object.freeze(
    new Map(
      Array.from(diffMap(headDevDependencies, devDependencies).entries()).map(([key, value]) => [
        key,
        value.replace(/^\^/u, '')
      ])
    )
  );

  return Object.freeze({
    dependencies: bumpedDependencies,
    devDependencies: bumpedDevDependencies,
    private: packageJSON.private === true
  });
}
