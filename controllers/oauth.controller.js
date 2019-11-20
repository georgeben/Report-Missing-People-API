const path = require('path');

const HOME_DIR = path.join(__dirname, '..');
/* eslint-disable import/no-dynamic-require */
const { logger } = require(path.join(HOME_DIR, 'utils'));
const { oauthService, userService } = require(path.join(HOME_DIR, 'services'));

/**
 * Signs in a user using Google OAUTH
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Object} next - Next middleware function
 */
async function googleSignIn(req, res, next) {
  const { id_token } = req.body;
  try {
    // Retreieve user data
    const payload = await oauthService.verifyGoogleIDToken(id_token);

    // Check if user exists
    const user = await userService.findUserByEmail(payload.email);
    if (user) {
      // User has already registered, sign user in
      return res.status(200).json({
        data: {
          message: 'This user is already registered',
          token: 'jwttoken',
        },
      });
    }
    const userData = {
      fullname: payload.name,
      firstname: payload.given_name,
      lastname: payload.family_name,
      email: payload.email,
      photoURL: payload.picture,
      googleID: payload.sub,
    };
    const createdUser = await userService.createUser(userData);
    res.status(201).json({
      data: {
        message: 'Successfully created user',
        id: createdUser._id,
        fullname: createdUser.fullname,
        email: createdUser.email,
      },
    });
  } catch (error) {
    console.log(error);
    logger.log('error', 'Shit happens', {
      error,
    });
    res.status(500).json({
      error: 'I think I fucked up',
    });
  }
}

/**
 * Route handler for Facebook Login
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Object} next - Next middleware function
 */
async function facebookSignIn(req, res, next) {
  const fbUserProfile = req.user;
  console.log('FB User profile', fbUserProfile);
  // Warning: With facebook, the user's email is not guaranteed to exist
  const fbEmail = fbUserProfile.emails[0].value;
  console.log('Users email is', fbEmail);
  try {
    // Check if user exists
    let user;
    if (fbEmail) {
      // Find user by email
      user = await userService.findUserByEmail(fbEmail);
    } else {
      user = await userService.findUserByFacebookID(fbUserProfile.id);
    }
    console.log({ user });
    if (user) {
      // User has already registered, sign user in
      return res.status(200).json({
        data: {
          message: 'This user is already registered',
          token: 'jwttoken',
        },
      });
    }

    const userData = {
      fullname: `${fbUserProfile.name.givenName} ${fbUserProfile.name.familyName}`,
      firstname: fbUserProfile.name.givenName,
      lastname: fbUserProfile.name.familyName,
      photoURL: `http://graph.facebook.com/${fbUserProfile.id}/picture?type=square`,
      facebookID: fbUserProfile.id,
    };
    if (fbEmail) userData.email = fbEmail;
    const createdUser = await userService.createUser(userData);
    res.status(201).json({
      data: {
        message: 'Successfully created user',
        id: createdUser._id,
        fullname: createdUser.fullname,
        email: createdUser.email,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  googleSignIn,
  facebookSignIn,
};
