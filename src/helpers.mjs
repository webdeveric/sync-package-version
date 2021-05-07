import { readFile, writeFile } from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';

import { uniqueItems } from '@webdeveric/utils';

export function getAbsolutePaths( files, cwd )
{
  return uniqueItems(
    files.map(
      file => path.isAbsolute( file ) ? file : path.resolve( cwd, file ),
    ),
  );
}

export function getJsonIndentation( contents )
{
  const matches = contents.match(/(?<=[{[]\n+)(?<spaces>[ \t]+)/);

  if ( matches ) {
    const { spaces } = matches.groups;

    return /[ ]+/.test( spaces ) ? spaces.length : spaces;
  }

  return null;
}

export function getTrailingWhitespace( contents )
{
  const matches = contents.match(/\s+$/s);

  return matches ? matches[ 0 ] : '';
}

export async function readJson( file )
{
  const contents = await readFile( file, {
    encoding: 'utf8',
    flag: fs.constants.O_RDONLY,
  });

  return {
    space: getJsonIndentation( contents ),
    trailingWhitespace: getTrailingWhitespace( contents ),
    data: JSON.parse( contents ),
  };
}

export async function syncVersion( file, version )
{
  const { data, space, trailingWhitespace } = await readJson( file );

  Object.assign( data, { version } );

  const contents = JSON.stringify( data, null, space );

  await writeFile( file, `${contents}${trailingWhitespace}` );

  return file;
}
