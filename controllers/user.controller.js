const { userService } = require('../services');
const { authHelper } = require('../utils');

/**
 * Route handler for registering a new user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {fUNCTION} next
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

module.exports = {
  signUpUser,
};
