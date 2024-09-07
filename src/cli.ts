#!/usr/bin/env -S node --experimental-json-modules --no-warnings
import * as commands from '@commands/index.js';
import pkg from '@webdeveric/sync-package-version/package.json' assert { type: 'json' };

import { Application } from './Application.js';
import { assertSupportedNodeVersion } from './assertions.js';

try {
  assertSupportedNodeVersion(process.versions.node);

  const app = new Application({
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    commands: Object.values(commands).map((Cmd) => new Cmd()),
  });

  await app.parseAsync(process.argv);
} catch (error) {
  console.error(error);

  process.exitCode ||= 1;
}
