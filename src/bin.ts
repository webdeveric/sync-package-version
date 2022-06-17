#!/usr/bin/env node
import { Command } from 'commander';
import semver from 'semver';

import {
  engines,
  } from '@webdeveric/sync-package-version/package.json' assert { type: 'json'
};

import { application } from './application.js';

if (! semver.satisfies(process.versions.node, engines.node)) {
  throw new Error(
    `NodeJs ${engines.node} is required. You're running version ${process.versions.node}`,
  );
}

try {
  await application.run(new Command(), process.argv);
} catch (error) {
  console.error(error);

  process.exitCode ||= 1;
}
