const path = require('path');
const { processConfirmEmail, processForgotPasswordMail } = require('../background-jobs');

const HOME_DIR = path.join(__dirname, '..');

const { logger, authHelper } = require(path.join(HOME_DIR, 'utils'));
const { oauthService, userService, emailService } = require(path.join(HOME_DIR, 'services'));

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
  const token = await authHelper.signJWTToken(userData);
  return token;
}

/**
 * @param {Object} user - Removes the password field from the user object
 */
function removePassword(user) {
  const { password, ...userData } = user.toJSON();
  return userData;
}

/**
 * Route handler for registering a new user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {function} next
 */
async function signUpUser(req, res, next) {
  const {
    firstname, lastname, fullname, email, password,
  } = req.body;
  // Check if user exists
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

    let createdUser = await userService.createUser(userData);
    createdUser = removePassword(createdUser);
    const token = await generateJWTToken(createdUser);
    // Add the send confirmation email job to the queue
    processConfirmEmail(email);

    return res.status(201).json({
      data: {
        message: 'Successfully created user',
        user: {
          ...createdUser,
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
    let existingUser = await userService.findUserByEmail(email);
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

    existingUser = removePassword(existingUser);
    const token = await generateJWTToken(existingUser);

    return res.status(200).json({
      data: {
        user: existingUser,
        token,
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
    let existingUser = await userService.findUserByEmail(payload.email);
    if (existingUser) {
      existingUser = existingUser.toJSON();
      const token = await generateJWTToken(existingUser);
      return res.status(200).json({
        data: {
          user: {
            ...existingUser,
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
      verifiedEmail: true,
    };
    let createdUser = await userService.createUser(userData);

    const token = await generateJWTToken(createdUser);
    createdUser = createdUser.toJSON();

    return res.status(201).json({
      data: {
        message: 'Successfully created user',
        user: {
          ...createdUser,
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
      existingUser = existingUser.toJSON();
      const token = await generateJWTToken(existingUser);
      return res.status(200).json({
        data: {
          user: {
            ...existingUser,
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
    if (fbEmail) {
      userData.email = fbEmail;
      userData.verifiedEmail = true;
    }
    let createdUser = await userService.createUser(userData);

    const token = await generateJWTToken(createdUser);
    createdUser = createdUser.toJSON();
    return res.status(201).json({
      data: {
        message: 'Successfully created user',
        user: {
          ...createdUser,
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
      `https://api.twitter.com/oauth/authorize?oauth_token=${twitterRequestToken}`,
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
      // Sign the user in
      const token = await generateJWTToken(existingUser);
      existingUser = existingUser.toJSON();
      return res.status(200).json({
        data: {
          user: {
            ...existingUser,
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
    let createdUser = await userService.createUser(userData);

    const token = await generateJWTToken(createdUser);
    createdUser = createdUser.toJSON();

    return res.status(201).json({
      data: {
        message: 'Successfully created user',
        user: {
          ...createdUser,
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

/**
 * Route handler for verifying a user's email
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next
 */
async function verifyEmail(req, res, next) {
  try {
    const { token } = req.body;
    const email = await authHelper.decodeJWTToken(token);
    // check if the email exists before it is verified
    const exists = await userService.findUserByEmail(email);
    if (!exists) {
      return res.status(404).json({
        error: 'Account for this email is not found',
      });
    }
    const verifiedEmail = await userService.checkEmailVerificationStatus(email);
    if (verifiedEmail) {
      return res.status(409).json({
        error: 'Email has already been verified',
      });
    }

    const updatedUser = await userService.verifyUserEmail(email);
    // Regenerate a new token
    const updatedToken = await generateJWTToken(updatedUser);
    console.log({ updatedToken });

    return res.status(200).json({
      data: {
        user: updatedUser,
        token: updatedToken,
      },
    });
  } catch (error) {
    console.log('Boom', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        error: 'Email verification failed',
      });
    }
    // TODO: Handle error
  }
}

/**
 * Route handler for resending the confirmation email to a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next
 */
async function resendVerificationEmail(req, res, next) {
  try {
    const { email } = req.user;
    if (!email) {
      return res.status(400).json({
        error: 'Email not supplied',
      });
    }
    const verifiedEmail = await userService.checkEmailVerificationStatus(email);
    if (verifiedEmail) {
      return res.status(409).json({
        error: 'Email has already been verified',
      });
    }
    emailService.sendConfirmationEmail(email);
    return res.status(200).json({
      data: {
        message: 'Confirmation email has been sent',
      },
    });
  } catch (error) {
    console.log(error);
    // Handle error
  }
}

/**
 * Route handler for sending reset password mail
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next
 */

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const existingAccount = await userService.findUserByEmail(email, false);
    if (!existingAccount) {
      return res.status(404).json({
        error: 'This account does not exist',
      });
    }

    processForgotPasswordMail(email);

    return res.status(200).json({
      data: {
        message: 'Password reset mail has been sent to you',
      },
    });
  } catch (error) {
    console.log(error);
    // TODO: Handle error
  }
}

/**
 * Route handler for resetting a user's password
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next
 */
async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    const { email } = await authHelper.decodeJWTToken(token);
    const hashedPassword = await authHelper.generatePasswordHash(password);

    // Change the password of whoever has that email
    await userService.resetPassword(email, hashedPassword);
    return res.status(200).json({
      data: {
        message: 'Successfully reset password',
      },
    });
  } catch (error) {
    console.log(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        error: 'Password reset failed',
      });
    }
    // TODO Handle error
  }
}

module.exports = {
  googleSignIn,
  facebookSignIn,
  getTwitterAuthorization,
  twitterSignIn,
  signUpUser,
  signInUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
};
