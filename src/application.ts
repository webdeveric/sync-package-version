import {
  description,
  name,
  version,
  } from '@webdeveric/sync-package-version/package.json' assert { type: 'json'
};

import * as commands from './commands/index.js';

import type { Command } from 'commander';

export const application = {
  async run(program: Command, argv: typeof process.argv): Promise<void> {
    program
      .name(name.split('/')[ 1 ])
      .description(description)
      .version(version);

    Object.entries(commands).forEach(([ , customCommand ]) => {
      customCommand.register(program);
    });

    await program.parseAsync(argv);
  },
};

