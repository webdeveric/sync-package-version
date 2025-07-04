import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, it, expect } from 'vitest';

import { getJsonIndentation, getTrailingWhitespace, readJson } from './helpers.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = fileURLToPath(new URL('.', import.meta.url));

describe('getJsonIndentation()', function () {
  it('returns number of spaces', () => {
    expect(getJsonIndentation('{\n "test": true }')).to.equal(1);
    expect(getJsonIndentation('{\n  "test": true }')).to.equal(2);
    expect(getJsonIndentation('{\n   "test": true }')).to.equal(3);
    expect(getJsonIndentation('{\n    "test": true }')).to.equal(4);
  });

  it('returns space character', () => {
    expect(getJsonIndentation('{\n\t"test": true }')).to.equal('\t');
    expect(getJsonIndentation('{\n\t\t"test": true }')).to.equal('\t\t');
  });

  it('returns zero when no spacing detected', () => {
    expect(getJsonIndentation('{\n"test": true }')).to.equal(0);
    expect(getJsonIndentation('{ "test": true }')).to.equal(0);
  });
});

describe('getTrailingWhitespace()', function () {
  it('returns a string containing the trailing whitespace', async () => {
    expect(getTrailingWhitespace('{ "test": true }\n\n')).to.equal('\n\n');
  });

  it('returns empty string when trailing whitespace is not found', async () => {
    expect(getTrailingWhitespace('test')).to.equal('');
  });
});

describe('readJson()', function () {
  it('returns json data', async () => {
    const json = await readJson(join(__dirname, '../package.json'));

    expect(json.data).to.be.instanceOf(Object);
  });
});
