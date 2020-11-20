'use strict';

const path = require('path');
const mockFs = require('mock-fs');
const { expect } = require('chai');

const {
  getAbsolutePaths,
  getJsonIndentation,
  getTrailingWhitespace,
  readJson,
  syncVersion,
} = require('../src/helpers.js');

describe('getAbsolutePaths()', function() {
  it('returns an array of file paths', () => {
    const files = getAbsolutePaths([ __filename ]);

    expect( files ).to.include.members([ __filename ]);
  });

  it('returns an array of file paths using custom CWD', () => {
    const files = getAbsolutePaths([ path.basename( __filename ) ], __dirname);

    expect( files ).to.include.members([ __filename ]);
  });
});

describe('getJsonIndentation()', function() {
  it('returns number of spaces', () => {
    expect( getJsonIndentation('{\n "test": true }') ).to.equal( 1 );
    expect( getJsonIndentation('{\n  "test": true }') ).to.equal( 2 );
    expect( getJsonIndentation('{\n   "test": true }') ).to.equal( 3 );
    expect( getJsonIndentation('{\n    "test": true }') ).to.equal( 4 );
  });

  it('returns space character', () => {
    expect( getJsonIndentation('{\n\t"test": true }') ).to.equal('\t');
    expect( getJsonIndentation('{\n\t\t"test": true }') ).to.equal('\t\t');
  });

  it('returns null when no spacing detected', () => {
    expect( getJsonIndentation('{\n"test": true }') ).to.be.null;
    expect( getJsonIndentation('{ "test": true }') ).to.be.null;
  });
});

describe('getTrailingWhitespace()', function() {
  it('returns a string containing the trailing whitespace', async () => {
    expect( getTrailingWhitespace('{ "test": true }\n\n') ).to.equal('\n\n');
  });
});

describe('readJson()', function() {
  it('returns json data', async () => {
    const json = await readJson( path.join( __dirname, '../package.json') );

    expect( json.data ).to.be.instanceOf( Object );
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
      expect( (await readJson( file )).data.version ).to.equal('0.1.0');
      expect( await syncVersion( file, '1.0.0') ).to.equal( file );
      expect( (await readJson( file )).data.version ).to.equal('1.0.0');
    });
  });
});
