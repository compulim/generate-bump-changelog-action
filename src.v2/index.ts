/* eslint-disable no-console */

import { compare, valid } from 'semver';
import { simpleGit } from 'simple-git';
import diffDependencies from './private/diffDependencies.ts';
import iteratorWorkspaces from './private/iterateWorkspaces.ts';
import npmPackageToMarkdownLink from './private/npmPackageToMarkdownLink.ts';
import sortKeyAsString from './private/sortKeyAsString.ts';

const allDependencies = new Map<string, Set<string>>();
const allDevDependencies = new Map<string, Set<string>>();
const baseRef = `refs/tags/${(await simpleGit().tags()).all
  .filter(tag => tag.startsWith('v') && valid(tag))
  .sort(compare)
  // eslint-disable-next-line no-magic-numbers
  .at(-1)}`;

for await (const { packageJSONFilename } of iteratorWorkspaces({ includeWorkspaceRoot: true })) {
  // eslint-disable-next-line no-magic-numbers
  const { isPrivate, dependencies, devDependencies } = await diffDependencies(packageJSONFilename, baseRef);

  for (const [key, value] of devDependencies) {
    allDevDependencies.set(key, (allDevDependencies.get(key) ?? new Set()).add(value));
  }

  // Production dependencies in non-publishing packages are considered development dependencies.
  for (const [key, value] of dependencies) {
    if (isPrivate) {
      allDevDependencies.set(key, (allDevDependencies.get(key) ?? new Set()).add(value));
    } else {
      // Delete from devDependencies if any.
      allDevDependencies.delete(key);

      allDependencies.set(key, (allDependencies.get(key) ?? new Set()).add(value));
    }
  }
}

console.log(
  `- Bumped dependencies, in PR [#XXX](https://github.com/compulim/repo/pull/XXX), since ${baseRef}`
);

if (allDependencies.size) {
  console.log('   - Production dependencies');

  for (const [name, versions] of sortKeyAsString(allDependencies)) {
    for (const version of Array.from(versions).sort()) {
      console.log(`      - ${npmPackageToMarkdownLink(name, version)}`);
    }
  }
}

if (allDevDependencies.size) {
  console.log('   - Development dependencies');

  for (const [name, versions] of sortKeyAsString(allDevDependencies)) {
    for (const version of Array.from(versions).sort()) {
      console.log(`      - ${npmPackageToMarkdownLink(name, version)}`);
    }
  }
}
