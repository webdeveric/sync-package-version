#!/usr/bin/env -S node --experimental-json-modules --no-warnings

import { build } from 'esbuild';
import { clean } from 'esbuild-plugin-clean';
import { esbuildPluginNodeExternals } from 'esbuild-plugin-node-externals';
import { trimIndentation } from '@webdeveric/utils/trimIndentation';

import pkg from './package.json' assert { type: 'json' };

try {
  const results = await build({
    entryPoints: [ './src/cli.ts' ],
    outdir: './dist',
    platform: 'node',
    bundle: true,
    format: 'esm',
    target: `node${process.versions.node}`,
    external: [
      // './node_modules/*',
      '@webdeveric/sync-package-version/package.json',
      './package.json',
    ],
    minify: true,
    banner: {
      js: trimIndentation(`
        /*!
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
      // Don't use `node_modules` in `external` until https://github.com/evanw/esbuild/issues/2246 is resolved.
      esbuildPluginNodeExternals(),
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
