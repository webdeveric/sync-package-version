#!/usr/bin/env -S node --experimental-json-modules --no-warnings

import { build } from 'esbuild';
import { clean } from 'esbuild-plugin-clean';
import { trimIndentation } from '@webdeveric/utils/trimIndentation';

import pkg from './package.json' assert { type: 'json' };

try {
  const entryPoints = [ './src/cli.ts' ];

  const results = await build({
    entryPoints,
    outdir: './dist',
    platform: 'node',
    bundle: true,
    format: 'esm',
    target: `node${process.versions.node}`,
    external: [ './node_modules/*', './package.json' ],
    minify: true,
    banner: {
      js: trimIndentation(`
        /**!
         * @file ${pkg.name} | ${pkg.description}
         * @version ${pkg.version}
         * @author ${pkg.author.name} <${pkg.author.email}>
         * @license ${pkg.license}
         */
      `),
    },
    plugins: [
      clean({
        patterns: [ './dist/*' ],
      }),
    ],
  });

  if (results.warnings.length) {
    console.warn(results.warnings);
  }

  if (results.errors.length) {
    throw new AggregateError(results.errors, 'Build error');
  }
} catch (error) {
  console.error(error);

  process.exitCode ||= 1;
}
