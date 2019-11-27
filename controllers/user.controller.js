const { userService } = require('../services');

/**
 * Route handler for retrieving data about the logged in user
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

async function updateUserProfile(req, res, next) {
  try {
    /* TOD0: Add validation to the fields that are getting
      updated, so people don't update empty fields or rubbish */
    const { profile } = req.body;
    const { id } = req.user;

    // Check if they uploaded a file i.e profile image

    // Upload the image to cloudinary and retrieve the URL
    // Add the new URL to the user's profile
    let updatedUser = await userService.updateUserProfile(id, profile);
    updatedUser = updatedUser.toJSON();
    return res.status(200).json({
      data: {
        ...updatedUser,
      },
    });
  } catch (error) {
    console.log(error);
    // Handle error
  }
}

module.exports = {
  updateUserProfile,
  getUserData,
};
