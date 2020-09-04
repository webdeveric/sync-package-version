const fs = require('fs');
const path = require('path');

function uniqueItems( data )
{
  return [ ...new Set( data ) ];
}

function getAbsolutePaths( files, cwd )
{
  return uniqueItems(
    files.map(
      file => path.isAbsolute( file ) ? file : path.resolve( cwd, file )
    )
  );
}

async function readJson( file )
{
  const contents = await fs.promises.readFile( file, { encoding: 'utf8' });

  return JSON.parse( contents );
}

async function syncVersion( file, version )
{
  const data = Object.assign(
    await readJson( file ),
    {
      version,
    },
  );

  const contents = JSON.stringify( data, null, 2 );

  await fs.promises.writeFile( file, `${contents}\n` );

  return file;
}

module.exports = {
  getAbsolutePaths,
  readJson,
  syncVersion,
  uniqueItems,
};
