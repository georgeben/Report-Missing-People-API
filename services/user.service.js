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
 * Retrieves a user from the db using the user's id
 * @param {String} id - User's id
 * @param {Boolean} includePassword - Select the user password
 * @returns {Object} user - The user
 */
async function findUserByID(id, includePassword = false) {
  let user;
  if (includePassword) {
    user = await UserModel.findById(id);
  } else {
    user = await UserModel.findById(id).select('-password');
  }
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

/**
 * Updates a user's profile. Profile information
 * includes names, photo country, state and address.
 * @param {String} id - The ID of the user to update
 * @param {Object} userData - The data of the user to be created
 * @returns {Object} user - The updated user
 */
async function updateUserProfile(id, {
  fullname,
  firstname,
  lastname,
  photoURL,
  country,
  state,
  address,
}) {
  /* Destructuring the profile information passed to this
  method to ensure that only the correct fields are updated
  in case wrong fields are passed
  */
  let user = await findUserByID(id);
  user.fullname = fullname;
  user.firstname = firstname;
  user.lastname = lastname;
  user.photoURL = photoURL;
  user.country = country;
  user.state = state;
  user.address = address;

  user = await user.save();
  return user;
}

module.exports = {
  findUserByEmail,
  createUser,
  findUserByFacebookID,
  findUserByTwitterID,
  findUserByID,
  updateUserProfile,
};
