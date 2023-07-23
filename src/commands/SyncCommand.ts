import { resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';

import { type Command, Option } from 'commander';
import get from 'lodash.get';
import { getType } from '@webdeveric/utils/getType';
import { isPrimitive } from '@webdeveric/utils/type-predicate';
import set from 'lodash.set';
import { uniqueItems } from '@webdeveric/utils/uniqueItems';

import type Application from '@src/Application.js';
import { CustomCommand } from '@commands/CustomCommand.js';
import { readJson } from '@src/helpers.js';

export type SyncOptions = {
  packageVersion: string;
  propertyPath: string;
  force: boolean;
};

export class SyncCommand extends CustomCommand {
  register(app: Application): Command {
    const command = app
      .command('sync', { isDefault: true })
      .description('Sync your package.json version across other files')
      .addOption(new Option('--package-version <version>', 'Custom version number').makeOptionMandatory().env('npm_package_version'))
      .option('--property-path <path>', 'The path to the property in the destination. Examples: "collection[0].version" "some.deep.object.version"', 'version')
      .option('--force', 'Force sync, ignoring destination data type', false)
      .argument('<files...>', 'Sync version number to these files')
      .action(this.action.bind(this));

    return command;
  }

  async syncVersion(
    file: string,
    options: SyncOptions,
  ): Promise<string> {
    const { packageVersion, propertyPath = 'version', force } = options;
    const { data, space, trailingWhitespace } = await readJson(file);

    const existingValue = get(data, propertyPath);

    if (! force && ! isPrimitive(existingValue)) {
      throw new Error(`Replacing ${getType(existingValue)} with ${getType(packageVersion)} in ${file}\n`);
    }

    set(data, propertyPath, packageVersion);

    const contents = JSON.stringify(data, null, space);

    await writeFile(file, `${contents}${trailingWhitespace}`);

    return file;
  }

  async action(files: string[], options: SyncOptions, cmd: Command): Promise<void> {
    const updatedFiles = await Promise.all(
      uniqueItems(files.map((file => resolve(file))))
        .map( file => this.syncVersion( file, options ) ),
    );

    updatedFiles.forEach(file => cmd.configureOutput().writeOut?.(`${file}\n`));
  }
}

export default SyncCommand;
