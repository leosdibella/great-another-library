import { isFunction } from 'src/lib/utilities';

describe('Utilities', () => {
  it('isFunction - Should determine if a given value is a function or not.', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true);
    expect(isFunction(class Ok {})).toBe(true);
    expect(isFunction(true)).toBe(false);
    expect(isFunction(1)).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
    expect(isFunction('')).toBe(false);
    expect(isFunction(new Map())).toBe(false);
    expect(isFunction(new Set())).toBe(false);
    expect(isFunction(BigInt(1))).toBe(false);
    expect(isFunction(Symbol('a'))).toBe(false);
    expect(isFunction(isFunction)).toBe(true);
  });
});
