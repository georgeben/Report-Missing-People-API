const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

Promise.promisifyAll(jwt);

const saltRounds = 10;
/**
 * Generates hash from a password
 * @param {String} password User's password
 * @returns {Promise} A promise object representing the value of the hashed password
 * */
async function generatePasswordHash(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        reject(err);
        return;
      }
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(hash);
      });
    });
  });
}

/**
 * Compares the plain text password with the hashed password for a match
 * @param  {string} password Plain text password
 * @param  {string} hash     Hashed password
 * @return {Promise} Resolves to a boolean value indicating if passwords match
 */
async function comparePassword(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  });
}

/**
 * Creates a signed JWT token
 * @param  {Object} payload - Data to be encoded in the JWT token
 * @return {String} token - Returns a promise containing the signed token
 */
async function signJWTToken(payload) {
  const token = await jwt.sign(payload, process.env.JWT_SECRET);
  return token;
}

/**
 * Decodes a JWT jwtToken
 * @param  {String} jwtToken - The JWT token to decode
 * @return {Object} Returns an object representing the decoded data
 */

async function decodeJWTToken(jwtToken) {
  const decoded = await jwt.verify(jwtToken, process.env.JWT_SECRET);
  return decoded;
}

/**
 * Generates a JWT for a user
 * @param {Object} user - The user to generate a JWT for
 * @returns {String} token - The JWT token
 */
async function generateJWTToken(user) {
  const userData = {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    slug: user.slug,
    verifiedEmail: user.verifiedEmail,
    completedProfile: user.completedProfile,
  };
  const token = await signJWTToken(userData);
  return token;
}

module.exports = {
  generatePasswordHash,
  comparePassword,
  signJWTToken,
  decodeJWTToken,
  generateJWTToken,
};
