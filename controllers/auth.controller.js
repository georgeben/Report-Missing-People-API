const path = require('path');

const HOME_DIR = path.join(__dirname, '..');

const { logger, authHelper } = require(path.join(HOME_DIR, 'utils'));
const { oauthService, userService } = require(path.join(HOME_DIR, 'services'));

/**
 * Route handler for registering a new user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {function} next
 */
async function signUpUser(req, res, next) {
  const { firstname, lastname, fullname, email, password } = req.body;
  // Check if user exisits
  try {
    const user = await userService.findUserByEmail(email);
    if (user) {
      return res.status(409).json({
        error: 'An account with that email already exists',
      });
    }

    const hashedPassword = await authHelper.generatePasswordHash(password);
    const userData = {
      firstname,
      lastname,
      fullname,
      email,
      password: hashedPassword,
    };

    const createdUser = await userService.createUser(userData);

    // Generate jwt token
    const createdUserData = {
      id: createdUser._id,
      fullname: createdUser.fullname,
      email: createdUser.email,
    };
    const token = await authHelper.signJWTToken(createdUserData);

    return res.status(201).json({
      data: {
        message: 'Successfully created user',
        user: {
          ...createdUserData,
          token,
        },
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
 * Route handler for signing in a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {function} next
 */
async function signInUser(req, res, next) {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const existingUser = await userService.findUserByEmail(email);
    if (!existingUser) {
      return res.status(404).json({
        error: 'The user does not exist. Create an account first.',
      });
    }

    // Check if passwords match
    const match = await authHelper.comparePassword(
      password,
      existingUser.password,
    );
    if (!match) {
      return res.status(401).json({
        error: 'Invalid user credentials',
      });
    }

    // Generate jwt token
    const userData = {
      id: existingUser._id,
      fullname: existingUser.fullname,
      email: existingUser.email,
    };
    const token = await authHelper.signJWTToken(userData);

    return res.status(200).json({
      data: {
        user: {
          ...userData,
          token,
        },
      },
    });
  } catch (error) {
    console.log('Boom', error);
    // Handle error
    return res.status(500).json({
      error: 'Something bad happened',
    });
  }
}

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
    const existingUser = await userService.findUserByEmail(payload.email);
    if (existingUser) {
      // User has already registered, sign user in
      const userData = {
        id: existingUser._id,
        fullname: existingUser.fullname,
        email: existingUser.email,
      };
      const token = await authHelper.signJWTToken(userData);
      return res.status(200).json({
        data: {
          user: {
            ...userData,
            token,
          },
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

    // Generate jwt token
    const createdUserData = {
      id: createdUser._id,
      fullname: createdUser.fullname,
      email: createdUser.email,
    };
    const token = await authHelper.signJWTToken(createdUserData);

    return res.status(201).json({
      data: {
        message: 'Successfully created user',
        user: {
          ...createdUserData,
          token,
        },
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
    let existingUser;
    if (fbEmail) {
      // Find user by email
      existingUser = await userService.findUserByEmail(fbEmail);
    } else {
      existingUser = await userService.findUserByFacebookID(fbUserProfile.id);
    }
    if (existingUser) {
      // User has already registered, sign user in
      const userData = {
        id: existingUser._id,
        fullname: existingUser.fullname,
        email: existingUser.email,
      };
      const token = await authHelper.signJWTToken(userData);
      return res.status(200).json({
        data: {
          user: {
            ...userData,
            token,
          },
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

    // Generate jwt token
    const createdUserData = {
      id: createdUser._id,
      fullname: createdUser.fullname,
      email: createdUser.email,
    };
    const token = await authHelper.signJWTToken(createdUserData);
    return res.status(201).json({
      data: {
        message: 'Successfully created user',
        user: {
          ...createdUserData,
          token,
        },
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
    return res.redirect(
      302,
      `https://api.twitter.com/oauth/authorize?oauth_token=${twitterRequestToken}`
    );
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
    let existingUser;
    const { email: twitterEmail, id: twitterID } = twitterData;
    if (twitterEmail) {
      existingUser = await userService.findUserByEmail(twitterEmail);
    } else {
      existingUser = await userService.findUserByTwitterID(twitterID);
    }
    if (existingUser) {
      const userData = {
        id: existingUser._id,
        fullname: existingUser.fullname,
        email: existingUser.email,
      };
      const token = await authHelper.signJWTToken(userData);
      return res.status(200).json({
        data: {
          user: {
            ...userData,
            token,
          },
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

    // Generate jwt token
    const createdUserData = {
      id: createdUser._id,
      fullname: createdUser.fullname,
      email: createdUser.email,
    };
    const token = await authHelper.signJWTToken(createdUserData);

    return res.status(201).json({
      data: {
        message: 'Successfully created user',
        user: {
          ...createdUserData,
          token,
        },
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
  signUpUser,
  signInUser,
};
