const { userService } = require('../services');
const { authHelper } = require('../utils');

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

    return res.status(201).json({
      data: {
        message: 'Successfully created user',
        user: {
          id: createdUser._id,
          fullname: createdUser.fullname,
          email: createdUser.email,
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
    const match = await authHelper.comparePassword(password, existingUser.password);
    if (!match) {
      return res.status(401).json({
        error: 'Invalid user credentials',
      });
    }

    // Generate jwt token

    return res.status(200).json({
      data: {
        user: {
          id: existingUser._id,
          fullname: existingUser.fullname,
          email: existingUser.email,
          token: 'jwttoken',
        },
      },
    });
  } catch (error) {
    console.log(error);
    // Handle error
    return res.status(500).json({
      error: 'Something bad happened',
    });
  }
}

module.exports = {
  signUpUser,
  signInUser,
};
