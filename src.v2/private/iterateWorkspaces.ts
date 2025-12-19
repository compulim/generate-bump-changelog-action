import { array, object, parse, string } from 'valibot';
import { resolve } from 'path';
import { readFile } from 'fs/promises';

export default async function* iteratorWorkspaces(init: {
  readonly includeWorkspaceRoot: boolean;
}): AsyncIterableIterator<{ readonly packageJSONFilename: string }> {
  const currentWorkingDirectory = process.cwd();

  const { workspaces } = parse(
    object({ workspaces: array(string()) }),
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    JSON.parse(await readFile(resolve(currentWorkingDirectory, 'package.json'), 'utf-8'))
  );

  init.includeWorkspaceRoot && workspaces.unshift('./');

  for (const workspace of workspaces) {
    yield Object.freeze({ packageJSONFilename: resolve(currentWorkingDirectory, workspace, 'package.json') });
  }
}
