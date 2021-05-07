import { fileURLToPath } from 'node:url';
import path from 'node:path';

import mockFs from 'mock-fs';

import {
  getAbsolutePaths,
  getJsonIndentation,
  getTrailingWhitespace,
  readJson,
  syncVersion,
} from '../src/helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname( __filename );

describe('getAbsolutePaths()', function() {
  it('returns an array of file paths', () => {
    const files = getAbsolutePaths([ __filename ]);

    expect( files ).toEqual( expect.arrayContaining( [ __filename ] ) );
  });

  it('returns an array of file paths using custom CWD', () => {
    const files = getAbsolutePaths([ path.basename( __filename ) ], __dirname);

    expect( files ).toEqual( expect.arrayContaining( [ __filename ] ) );
  });
});

describe('getJsonIndentation()', function() {
  it('returns number of spaces', () => {
    expect( getJsonIndentation('{\n "test": true }') ).toEqual( 1 );
    expect( getJsonIndentation('{\n  "test": true }') ).toEqual( 2 );
    expect( getJsonIndentation('{\n   "test": true }') ).toEqual( 3 );
    expect( getJsonIndentation('{\n    "test": true }') ).toEqual( 4 );
  });

  it('returns space character', () => {
    expect( getJsonIndentation('{\n\t"test": true }') ).toEqual('\t');
    expect( getJsonIndentation('{\n\t\t"test": true }') ).toEqual('\t\t');
  });

  it('returns null when no spacing detected', () => {
    expect( getJsonIndentation('{\n"test": true }') ).toBeNull();
    expect( getJsonIndentation('{ "test": true }') ).toBeNull();
  });
});

describe('getTrailingWhitespace()', function() {
  it('returns a string containing the trailing whitespace', async () => {
    expect( getTrailingWhitespace('{ "test": true }\n\n') ).toEqual('\n\n');
  });
});

describe('readJson()', function() {
  it('returns json data', async () => {
    const json = await readJson( path.join( __dirname, '../package.json') );

    expect( json.data ).toBeInstanceOf( Object );
  });
});

describe('syncVersion()', function() {
  beforeEach(() => {
    mockFs({
      'package.json': JSON.stringify({ version: '1.0.0' }),
      'manifest.json': JSON.stringify({ version: '0.1.0' }, null, 2) + '\n',
      'example.json': JSON.stringify({ version: '0.1.0' }),
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('updates the version property in the file', async () => {
    [ 'manifest.json', 'example.json' ].forEach( async file => {
      expect( (await readJson( file )).data.version ).toEqual('0.1.0');
      expect( await syncVersion( file, '1.0.0') ).toEqual( file );
      expect( (await readJson( file )).data.version ).toEqual('1.0.0');
    });
  });
});
