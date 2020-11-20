'use strict';

const fs = require('fs');
const path = require('path');

const { uniqueItems } = require('@webdeveric/utils');

function getAbsolutePaths( files, cwd )
{
  return uniqueItems(
    files.map(
      file => path.isAbsolute( file ) ? file : path.resolve( cwd, file ),
    ),
  );
}

function getJsonIndentation( contents )
{
  const matches = contents.match(/(?<=[{[]\n+)(?<spaces>[ \t]+)/);

  if ( matches ) {
    const { spaces } = matches.groups;

    return /[ ]+/.test( spaces ) ? spaces.length : spaces;
  }

  return null;
}

function getTrailingWhitespace( contents )
{
  const matches = contents.match(/\s+$/s);

  return matches ? matches[ 0 ] : '';
}

async function readJson( file )
{
  const contents = await fs.promises.readFile( file, { encoding: 'utf8' });

  return {
    space: getJsonIndentation( contents ),
    trailingWhitespace: getTrailingWhitespace( contents ),
    data: JSON.parse( contents ),
  };
}

async function syncVersion( file, version )
{
  const { data, space, trailingWhitespace } = await readJson( file );

  Object.assign( data, { version } );

  const contents = JSON.stringify( data, null, space );

  await fs.promises.writeFile( file, `${contents}${trailingWhitespace}` );

  return file;
}

module.exports = {
  getAbsolutePaths,
  getJsonIndentation,
  getTrailingWhitespace,
  readJson,
  syncVersion,
};
