/* eslint-disable no-undef */
const chai = require('chai');

const { expect } = chai;
const authHelper = require('../utils/authHelper');

describe('AuthHelper', () => {
  it('should correctly hash a password', async () => {
    const password = 'hello';
    const hash = await authHelper.generatePasswordHash(password);
    const match = await authHelper.comparePassword(password, hash);
    expect(match).to.equal(true);
  });

  it('should correctly sign a JWT token', async () => {
    const data = { message: 'hello' };
    const jwt = await authHelper.signJWTToken(data);
    const decoded = await authHelper.decodeJWTToken(jwt);
    expect(decoded.message).to.equal('hello');
  });
});
