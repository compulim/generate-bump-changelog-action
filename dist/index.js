// src/index.ts
import * as core from "@actions/core";
import { parser, Release } from "keep-a-changelog";
import { readFile as readFile2, writeFile } from "node:fs/promises";
import { resolve as resolve2 } from "node:path";
import { array, boolean as boolean2, object as object2, optional as optional2, parse as parse2, string as string2 } from "valibot";

// src/private/diffDependencies.ts
import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import simpleGit from "simple-git";
import { boolean, object, optional, parse, record, string } from "valibot";

// src/private/diffMap.ts
function diffMap(from, to) {
  const diff = /* @__PURE__ */ new Map();
  for (const [key, value] of to) {
    from.get(key) === value || diff.set(key, value);
  }
  return Object.freeze(diff);
}

// src/private/diffDependencies.ts
var packageJSONSchema = object({
  dependencies: optional(record(string(), string())),
  devDependencies: optional(record(string(), string())),
  private: optional(boolean(), false)
});
async function diffDependencies(relativePathToProjectRoot) {
  const projectRoot2 = process.cwd();
  const packageJSONPath = resolve(projectRoot2, relativePathToProjectRoot);
  let headPackageJSON;
  try {
    headPackageJSON = parse(
      packageJSONSchema,
      JSON.parse(await simpleGit().show(`HEAD:${relative(projectRoot2, packageJSONPath)}`))
    );
  } catch {
    headPackageJSON = { private: true };
  }
  const packageJSON = parse(packageJSONSchema, JSON.parse(await readFile(packageJSONPath, "utf-8")));
  const headDependencies = new Map(Object.entries(headPackageJSON.dependencies || {}));
  const headDevDependencies = new Map(Object.entries(headPackageJSON.devDependencies || {}));
  const dependencies = new Map(Object.entries(packageJSON.dependencies || {}));
  const devDependencies = new Map(Object.entries(packageJSON.devDependencies || {}));
  const bumpedDependencies2 = Object.freeze(
    new Map(
      Array.from(diffMap(headDependencies, dependencies).entries()).map(([key, value]) => [
        key,
        value.replace(/^\^/u, "")
      ])
    )
  );
  const bumpedDevDependencies2 = Object.freeze(
    new Map(
      Array.from(diffMap(headDevDependencies, devDependencies).entries()).map(([key, value]) => [
        key,
        value.replace(/^\^/u, "")
      ])
    )
  );
  return Object.freeze({
    dependencies: bumpedDependencies2,
    devDependencies: bumpedDevDependencies2,
    private: packageJSON.private === true
  });
}

// src/private/mergeMap.ts
function mergeMap(...deps) {
  return Object.freeze(
    new Map(deps.reduce((merged, dep) => [...merged, ...Array.from(dep.entries())], []))
  );
}

// src/private/sortKeyAsString.ts
function sortKeyAsString(dependencies) {
  return Object.freeze(new Map(Array.from(dependencies.entries()).sort(([x], [y]) => x.localeCompare(y))));
}

// src/index.ts
var packageJSONSchema2 = object2({ bugs: optional2(object2({ url: string2() })), private: optional2(boolean2(), false) });
var projectRoot = process.cwd();
var changelogPath = resolve2(projectRoot, "CHANGELOG.md");
var pullRequestNumber = core.getInput("pull-request-number", { required: true, trimWhitespace: true });
var { workspaces } = parse2(
  object2({ workspaces: array(string2()) }),
  JSON.parse(await readFile2(resolve2(projectRoot, "package.json"), "utf-8"))
);
workspaces.unshift("./");
var results = await Promise.all(workspaces.map((path) => diffDependencies(resolve2(projectRoot, path, "package.json"))));
var allDependencies = results.map(
  (result) => result.private ? Object.freeze(/* @__PURE__ */ new Map()) : result.dependencies
);
var allDevDependencies = results.map(
  (result) => result.private ? mergeMap(result.dependencies, result.devDependencies) : result.devDependencies
);
var packageJSONs = await Promise.all(
  workspaces.map(
    async (path) => parse2(packageJSONSchema2, JSON.parse(await readFile2(resolve2(projectRoot, path, "package.json"), "utf-8")))
  )
);
var projectURL = packageJSONs.find((json) => !json.private)?.bugs?.url;
if (!projectURL) {
  throw new Error(`At least one public package must have bugs.url field set.`);
}
var bumpedDependencies = sortKeyAsString(mergeMap(...allDependencies));
var bumpedDevDependencies = sortKeyAsString(mergeMap(...allDevDependencies));
var changelog = parser(await readFile2(changelogPath, "utf-8"));
changelog.format = "markdownlint";
var bumpedDependenciesString = bumpedDependencies.size ? `- Production dependencies
${Array.from(bumpedDependencies.entries()).map(([key, value]) => `  - [\`${key}@${value}\`](${new URL(`${key}/v/${value}`, "https://npmjs.com/package/")})`).join("\n")}
` : "";
var bumpedDevDependenciesString = bumpedDevDependencies.size ? `- Development dependencies
${Array.from(bumpedDevDependencies.entries()).map(([key, value]) => `  - [\`${key}@${value}\`](${new URL(`${key}/v/${value}`, "https://npmjs.com/package/")})`).join("\n")}
` : "";
var release = changelog.findRelease();
release || changelog.addRelease(release = new Release());
release.changed(`Bumped dependencies, in PR [#${pullRequestNumber}](${new URL(
  pullRequestNumber,
  new URL("pull/", projectURL)
)})
${bumpedDependenciesString}${bumpedDevDependenciesString}
`);
await writeFile(changelogPath, changelog.toString());
core.setOutput("changelog", changelog.toString());
console.log(changelog.toString());
