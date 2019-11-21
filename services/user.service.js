const { UserModel } = require('../db/models');

/**
 * Retrieves a user from the db using an email address
 * @param {String} email - User's email
 * @returns {Object} user - The user's details if the user exists
 */
async function findUserByEmail(email) {
  const user = await UserModel.findOne({
    email,
  });
  return user;
}

/**
 *
 * @param {String} facebookID - User's facebook ID
 * @returns {Object} user - The user's details if the user exists
 */

async function findUserByFacebookID(facebookID) {
  const user = await UserModel.findOne({
    facebookID,
  });
  return user;
}

/**
 * @param {String} twitterID - User's twitter ID
 * @returns {Object} user - The user's details if the user exists
 */
async function findUserByTwitterID(twitterID) {
  const user = await UserModel.findOne({
    twitterID,
  });
  return user;
}

/**
 * Creates a new user
 * @param {Object} userData - The data of the user to be created
 * @returns {Object} newuser - The newly created user
 */
async function createUser(userData) {
  let newUser = new UserModel(userData);
  newUser = await newUser.save();
  return newUser;
}

module.exports = {
  findUserByEmail,
  createUser,
  findUserByFacebookID,
  findUserByTwitterID,
};
