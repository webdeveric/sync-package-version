import { build } from 'esbuild';

try {
  const entryPoints = [ './src/bin.ts' ];

  const results = await build({
    entryPoints,
    outdir: './dist',
    platform: 'node',
    bundle: true,
    format: 'esm',
    target: `node${process.versions.node}`,
    external: [ './node_modules/*' ],
    minify: true,
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
