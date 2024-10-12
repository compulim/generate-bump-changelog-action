import * as core from '@actions/core';
import { parser, Release } from 'keep-a-changelog';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { array, boolean, object, optional, parse, string } from 'valibot';

import diffDependencies from './private/diffDependencies.ts';
import mergeMap from './private/mergeMap.ts';
import sortKeyAsString from './private/sortKeyAsString.ts';

const packageJSONSchema = object({ bugs: optional(object({ url: string() })), private: optional(boolean(), false) });
const projectRoot = process.cwd();
const changelogPath = resolve(projectRoot, 'CHANGELOG.md');
const pullRequestNumber = core.getInput('pull-request-number', { required: true, trimWhitespace: true });

const { workspaces } = parse(
  object({ workspaces: array(string()) }),
  JSON.parse(await readFile(resolve(projectRoot, 'package.json'), 'utf-8'))
);

// Also add workspace root.
workspaces.unshift('./');

const results = await Promise.all(workspaces.map(path => diffDependencies(resolve(projectRoot, path, 'package.json'))));

// Production dependencies in non-publishing packages are considered development dependencies.
const allDependencies = results.map(result =>
  result.private ? Object.freeze(new Map<string, string>()) : result.dependencies
);
const allDevDependencies = results.map(result =>
  result.private ? mergeMap(result.dependencies, result.devDependencies) : result.devDependencies
);

const packageJSONs = await Promise.all(
  workspaces.map(async path =>
    parse(packageJSONSchema, JSON.parse(await readFile(resolve(projectRoot, path, 'package.json'), 'utf-8')))
  )
);

// Get package.json/bugs/url to generate pull request URL.
const projectURL = packageJSONs.find(json => !json.private)?.bugs?.url;

if (!projectURL) {
  throw new Error(`At least one public package must have bugs.url field set.`);
}

const bumpedDependencies = sortKeyAsString(mergeMap(...allDependencies));
const bumpedDevDependencies = sortKeyAsString(mergeMap(...allDevDependencies));

const changelog = parser(await readFile(changelogPath, 'utf-8'));

changelog.format = 'markdownlint';

const bumpedDependenciesString = bumpedDependencies.size
  ? `- Production dependencies
${Array.from(bumpedDependencies.entries())
  .map(([key, value]) => `  - [\`${key}@${value}\`](${new URL(`${key}/v/${value}`, 'https://npmjs.com/package/')})`)
  .join('\n')}
`
  : '';

const bumpedDevDependenciesString = bumpedDevDependencies.size
  ? `- Development dependencies
${Array.from(bumpedDevDependencies.entries())
  .map(([key, value]) => `  - [\`${key}@${value}\`](${new URL(`${key}/v/${value}`, 'https://npmjs.com/package/')})`)
  .join('\n')}
`
  : '';

let release = changelog.findRelease();

release || changelog.addRelease((release = new Release()));

release.changed(`Bumped dependencies, in PR [#${pullRequestNumber}](${new URL(
  pullRequestNumber,
  new URL('pull/', projectURL)
)})
${bumpedDependenciesString}${bumpedDevDependenciesString}
`);

await writeFile(changelogPath, changelog.toString());

core.setOutput('changelog',changelog.toString());

console.log(changelog.toString());
