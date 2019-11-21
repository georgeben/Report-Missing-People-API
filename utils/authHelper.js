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

module.exports = {
  generatePasswordHash,
};
