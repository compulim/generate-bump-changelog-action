import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { simpleGit } from 'simple-git';
import { boolean, object, optional, parse, record, string, type InferOutput } from 'valibot';

import diffMap from './diffMap.ts';

const packageJSONSchema = object({
  dependencies: optional(record(string(), string())),
  devDependencies: optional(record(string(), string())),
  private: optional(boolean(), false)
});

export default async function diffDependencies(
  filename: string,
  targetRef: string = 'origin/main'
): Promise<
  Readonly<{
    dependencies: ReadonlyMap<string, string>;
    devDependencies: ReadonlyMap<string, string>;
    isPrivate: boolean;
  }>
> {
  const currentWorkingDirectory = process.cwd();
  const packageJSONPath = resolve(currentWorkingDirectory, filename);

  let headPackageJSON: InferOutput<typeof packageJSONSchema>;

  try {
    headPackageJSON = parse(
      packageJSONSchema,
      JSON.parse(await simpleGit().show(`${targetRef}:${relative(currentWorkingDirectory, packageJSONPath)}`))
    );
  } catch {
    headPackageJSON = { private: true };
  }

  // eslint-disable-next-line security/detect-non-literal-fs-filename
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
    isPrivate: packageJSON.private === true
  });
}
