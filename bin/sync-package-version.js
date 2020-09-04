#!/usr/bin/env node

const {
  getAbsolutePaths,
  syncVersion,
} = require('../src/helpers');

const {
  // This is set when running inside an npm script.
  npm_package_version,
  PACKAGE_VERSION_OVERRIDE,
} = process.env;

const PACKAGE_VERSION = PACKAGE_VERSION_OVERRIDE !== undefined ? PACKAGE_VERSION_OVERRIDE : npm_package_version;

if ( PACKAGE_VERSION === undefined ) {
  console.log('npm_package_version or PACKAGE_VERSION_OVERRIDE is not defined in the environment.');

  process.exit(1);
}

const [ , , ...args ] = process.argv;

const filesToUpdate = getAbsolutePaths( args, process.cwd() );

function run( files, version )
{
  return Promise.all( files.map( file => syncVersion( file, version ) ) );
}

run( filesToUpdate, PACKAGE_VERSION ).then(
  files => {
    files.forEach(
      file => process.stdout.write(`${file}\n`)
    );
  },
  error => {
    console.error( error );

    process.exit(1);
  }
);
