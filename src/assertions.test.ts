import { describe, it, expect } from 'vitest';

import { assertSupportedNodeVersion } from './assertions.js';

describe('assertSupportedNodeVersion()', () => {
  it('Throws when running unsupported NodeJs version', () => {
    expect(() => {
      assertSupportedNodeVersion('1.2.3');
    }).throws();
  });
});
