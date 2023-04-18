import { memoize } from '@internal/webpack-utils';
import { describe, expect, it } from '@jest/globals';

describe('memoize', () => {
  it(`only calls the function once`, async () => {
    const array = [];
    const fn = memoize(() => array.push({}));
    [...new Array(10).keys()].forEach(fn);
    expect(array.length).toEqual(1);
    expect(fn()).toEqual(1);
  });
});
