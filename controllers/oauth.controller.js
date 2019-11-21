const path = require('path');

const HOME_DIR = path.join(__dirname, '..');
/* eslint-disable import/no-dynamic-require */
const { logger } = require(path.join(HOME_DIR, 'utils'));
const { oauthService, userService } = require(path.join(HOME_DIR, 'services'));

/**
 * Signs in a user using Google OAUTH
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Funtion} next - Next middleware function
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
    return res.status(201).json({
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
    return res.status(500).json({
      error: 'I think I fucked up',
    });
  }
}

/**
 * Route handler for Facebook Login
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - Next middleware function
 */
async function facebookSignIn(req, res, next) {
  const fbUserProfile = req.user;
  // Warning: With facebook, the user's email is not guaranteed to exist
  const fbEmail = fbUserProfile.emails[0].value;
  try {
    // Check if user exists
    let user;
    if (fbEmail) {
      // Find user by email
      user = await userService.findUserByEmail(fbEmail);
    } else {
      user = await userService.findUserByFacebookID(fbUserProfile.id);
    }
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
    return res.status(201).json({
      data: {
        message: 'Successfully created user',
        id: createdUser._id,
        fullname: createdUser.fullname,
        email: createdUser.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'Something went wrong',
    });
  }
}

/**
 * Route handler for Twitter sign in. Redirects user to the twitter
 * sign in page
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next
 */
async function getTwitterAuthorization(req, res, next) {
  try {
    const twitterRequestToken = await oauthService.getTwitterRequestToken();
    if (twitterRequestToken === false) {
      return res.status(500).json({
        error: 'Something went wrong',
      });
    }
    return res.redirect(`https://api.twitter.com/oauth/authorize?oauth_token=${twitterRequestToken}`, 302);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'Something went wrong',
    });
  }
}

/**
 * Route handler for Twitter sign in callback
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next
 */

async function twitterSignIn(req, res, next) {
  try {
    const {
      oauth_token: requestToken,
      oauth_verifier: oauthVerifier,
    } = req.query;
    const twitterData = await oauthService.getTwitterUserData(
      requestToken,
      oauthVerifier,
    );

    // Check if user exists
    let user;
    const { email: twitterEmail, id: twitterID } = twitterData;
    if (twitterEmail) {
      user = await userService.findUserByEmail(twitterEmail);
    } else {
      user = await userService.findUserByTwitterID(twitterID);
    }
    if (user) {
      return res.status(200).json({
        data: {
          message: 'This user is already registered',
          token: 'jwttoken',
        },
      });
    }

    const userData = {
      fullname: twitterData.name,
      photoURL: twitterData.profile_image_url_https,
      twitterID: twitterData.id,
    };

    if (twitterEmail) userData.email = twitterEmail;
    const createdUser = await userService.createUser(userData);

    return res.status(201).json({
      data: {
        message: 'Successfully created user',
        id: createdUser._id,
        fullname: createdUser.fullname,
        email: createdUser.email,
      },
    });
  } catch (error) {
    console.log(error);
    logger.log('error', error);
    return res.status(500).json({
      error: 'Something went wrong',
    });
  }
}

module.exports = {
  googleSignIn,
  facebookSignIn,
  getTwitterAuthorization,
  twitterSignIn,
};
