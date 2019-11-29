
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const { userService, cloudinaryService } = require('../services');

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

/**
 * Route handler for updating a user's profile information
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - Next middleware
 */
async function updateUserProfile(req, res, next) {
  try {
    let { fullname, country, state, address } = req.body;
    let profile = {
      fullname, country, state, address,
    };
    const { id } = req.user;
    const { file } = req;
    const user = await userService.findUserByID(id);
    // Check if they uploaded a file i.e profile image
    if (file) {
      // Check if the user previously uploaded a picture to cloudinary
      if (user.cloudinaryPhotoID) {
        // The user has uploaded a photo before, so delete it
        await cloudinaryService.deleteImage(
          user.cloudinaryPhotoID,
        );
      }
      // Upload the image to cloudinary and retrieve the URL
      let image = await cloudinaryService.uploadImage(
        file.path,
        'user_photos',
      );

      // Add the new URL to the user's profile
      profile.photoURL = image.secure_url;
      profile.cloudinaryPhotoID = image.public_id;

      // Delete the image from disk storage
      await fs.unlinkAsync(req.file.path);
    }

    let updatedUser = await userService.updateUserProfile(id, profile);
    updatedUser = updatedUser.toJSON();
    return res.status(200).json({
      data: {
        ...updatedUser,
      },
    });
  } catch (error) {
    console.log(error);
    // TODO:Handle error
  }
}

module.exports = {
  updateUserProfile,
  getUserData,
};
