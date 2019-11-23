const { userService } = require('../services');

/**
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - Next middleware
 */
async function getUserData(req, res, next) {
  const { id } = req.user;
  try {
    let user = await userService.findUserByID(id);
    user = user.toJSON();
    return res.status(200).json({
      data: {
        user: {
          ...user,
        },
      },
    });
  } catch (error) {
    console.log(error);
    // Handle error
  }
}

async function updateUserData(req, res, next) {
  //
}

module.exports = {
  updateUserData,
  getUserData,
};
