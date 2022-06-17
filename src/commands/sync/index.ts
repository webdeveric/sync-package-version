import { Command, Option } from 'commander';
import type { CustomCommand } from '../types.js';
import type { SyncOptions } from './sync-action.js';

export const syncCommand: CustomCommand = {
  register(program) {
    const command = program
      .command('sync', { isDefault: true })
      .description('Sync your package.json version across other files')
      .addOption(new Option('--package-version <version>', 'Custom version number').makeOptionMandatory().env('npm_package_version'))
      .option('--property-path <path>', 'The path to the property in the destination. Examples: "collection[0].version" "some.deep.object.version"', 'version')
      .option('--force', 'Force a sync, ignoring destination data type', false)
      .arguments('[files...]')
      .action(this.action);

    return command;
  },
  async action(files: string[], options: SyncOptions, cmd: Command) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { default: SyncCommandAction } = await import('./sync-action.js');

    const sync = new SyncCommandAction(files, options, cmd);

    await sync.run();
  },
};
