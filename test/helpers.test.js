const path = require('path');
const mockFs = require('mock-fs');
const { expect } = require('chai');

const {
  getAbsolutePaths,
  readJson,
  syncVersion,
  uniqueItems,
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

describe('readJson()', function() {
  it('returns json data', async () => {
    const data = await readJson( path.join( __dirname, '../package.json') );

    expect( data ).to.be.instanceOf( Object );
  });
});

describe('syncVersion()', function() {
  beforeEach(() => {
    mockFs({
      'package.json': JSON.stringify({ version: '1.0.0' }),
      'manifest.json': JSON.stringify({ version: '0.1.0' }),
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('updates the version property in the file', async () => {
    expect( (await readJson('manifest.json')).version ).to.equal('0.1.0');

    const filename = await syncVersion('manifest.json', '1.0.0');

    expect( filename ).to.equal('manifest.json');

    expect( (await readJson('manifest.json')).version ).to.equal('1.0.0');
  });
});

describe('uniqueItems()', function() {
  it('returns an array of unique items', () => {
    const items = uniqueItems([ 'cat', 'cat', 'dog' ]);

    expect( items.length ).to.equal( 2 );
    expect( items ).to.include.members([ 'cat', 'dog' ]);
  });
});
