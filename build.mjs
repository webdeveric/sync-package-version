#!/usr/bin/env -S node --experimental-json-modules --no-warnings

import { comment } from '@webdeveric/utils/comment';
import { build } from 'esbuild';
import { clean } from 'esbuild-plugin-clean';

import pkg from './package.json' assert { type: 'json' };

try {
  const results = await build({
    entryPoints: ['./src/cli.ts'],
    outdir: './dist',
    platform: 'node',
    bundle: true,
    format: 'esm',
    target: `node${process.versions.node}`,
    external: ['@webdeveric/sync-package-version/package.json', './package.json'],
    minify: true,
    packages: 'external',
    banner: {
      js: comment(
        `
        @file ${pkg.name} | ${pkg.description}
        @version ${pkg.version}
        @author ${pkg.author.name} <${pkg.author.email}>
        @license ${pkg.license}
        `,
        {
          type: 'legal',
        },
      ),
    },
    plugins: [
      clean({
        patterns: ['./dist/*'],
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
