const bcrypt = require('bcrypt');

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

module.exports = {
  generatePasswordHash,
  comparePassword,
};
