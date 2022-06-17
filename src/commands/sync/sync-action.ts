import assert from 'node:assert';
import { writeFile } from 'node:fs/promises';

import type { Command } from 'commander';
import get from 'lodash.get';
import set from 'lodash.set';

import { getType } from '@webdeveric/utils/getType';
import { isPrimitive } from '@webdeveric/utils/type-predicate';

import { getAbsolutePaths, readJson } from '@src/helpers.js';
import { CommandAction } from '@commands/CommandAction.js';

export type SyncOptions = {
  packageVersion: string;
  propertyPath: string;
  force: boolean;
};

export class SyncCommandAction extends CommandAction {
  constructor(
    private readonly files: string[],
    private readonly options: SyncOptions,
    private readonly command: Command,
  ) {
    super();
  }

  async syncVersion(
    file: string,
    version: string,
    propertyPath = 'version',
  ): Promise<string> {
    const { data, space, trailingWhitespace } = await readJson(file);

    const existingValue = get(data, propertyPath);

    if (! this.options.force && ! isPrimitive(existingValue)) {
      throw new Error(`Replacing ${getType(existingValue)} with ${getType(version)} in ${file}\n`);
    }

    set(data, propertyPath, version);

    const contents = JSON.stringify(data, null, space);

    await writeFile(file, `${contents}${trailingWhitespace}`);

    return file;
  }

  async run(): Promise<void> {
    const { packageVersion, propertyPath } = this.options;

    assert(packageVersion, 'Package version is required');
    assert(propertyPath, 'Property path is required');

    const updatedFiles = await Promise.all(
      getAbsolutePaths( this.files, process.cwd() ).map( file => this.syncVersion( file, packageVersion, propertyPath ) ),
    );

    updatedFiles.forEach(file => this.command.configureOutput().writeOut?.(`${file}\n`));
  }
}

export default SyncCommandAction;
