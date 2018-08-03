const expect = require('expect');
const {isRealString} = require('./validation.js');

describe('isRealString function', () => {
  it('should return true when a string non empty string is passed', () => {
    expect(isRealString('hello')).toBe(true);
  });

  it('should return false when an empty string is passed', () => {
    expect(isRealString('')).toBe(false);
  });

  it('should return false when an non string object is passed', () => {
    expect(isRealString(1)).toBe(false);
  });

  it('should return false when a string with only spaces is passed', () => {
    expect(isRealString('     ')).toBe(false);
  });
});