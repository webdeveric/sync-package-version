import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

import { expect } from 'chai';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = fileURLToPath(new URL('.', import.meta.url));

import {
  getAbsolutePaths, getJsonIndentation, getTrailingWhitespace, readJson,
} from './helpers.js';


describe('getAbsolutePaths()', function() {
  it('returns an array of file paths', () => {
    const files = getAbsolutePaths([ 'test.json' ], '/tmp/');

    expect( files ).to.include.members([ '/tmp/test.json' ]);
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

  it('returns zero when no spacing detected', () => {
    expect( getJsonIndentation('{\n"test": true }') ).to.equal(0);
    expect( getJsonIndentation('{ "test": true }') ).to.equal(0);
  });
});

describe('getTrailingWhitespace()', function() {
  it('returns a string containing the trailing whitespace', async () => {
    expect( getTrailingWhitespace('{ "test": true }\n\n') ).to.equal('\n\n');
  });
});

describe('readJson()', function() {
  it('returns json data', async () => {
    const json = await readJson( join(__dirname, '../package.json') );

    expect( json.data ).to.be.instanceOf( Object );
  });
});
