import assert from 'node:assert';

import semver from 'semver';

import pkg from '@webdeveric/sync-package-version/package.json' assert { type: 'json' };

export function assertSupportedNodeVersion(version = process.versions.node): void {
  assert(
    semver.satisfies(version, pkg.engines.node),
    `NodeJs ${pkg.engines.node} is required. You're running version ${process.versions.node}`,
  );
}
