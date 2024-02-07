import assert from 'node:assert';

import { satisfies } from 'semver';

import pkg from '@webdeveric/sync-package-version/package.json' assert { type: 'json' };

export function assertSupportedNodeVersion(version: string): asserts version {
  assert(
    satisfies(version, pkg.engines.node),
    `NodeJs ${pkg.engines.node} is required. You're running version ${version}.`,
  );
}
