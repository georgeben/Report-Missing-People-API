
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const { userService, cloudinaryService, caseService } = require('../services');
const { authHelper } = require('../utils');
const { processConfirmEmail } = require('../background-jobs');
const { userFolderName } = require('../config')();

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
    return next(error);
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
    const { fullname, residentialAddress } = req.body;
    const profile = {
      fullname, residentialAddress,
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
      const image = await cloudinaryService.uploadImage(
        file.path,
        userFolderName,
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
    return next(error);
  }
}

/**
 * Route handler for updating a user's email
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - Next middleware
 */
async function updateEmail(req, res, next) {
  try {
    // Get the user trying to update their email
    const { email } = req.body;
    // Check if that email has already been registered
    const existingEmail = await userService.findUserByEmail(email, false);
    if (existingEmail) {
      return res.status(409).json({
        error: 'That email has already been registered',
      });
    }
    // Update the email
    const updatedUser = await userService.updateUserEmail(req.user.email, email);
    const token = await authHelper.generateJWTToken(updatedUser);
    // Add the send confirmation email job to the queue
    processConfirmEmail(email);
    // Send response to the user
    return res.status(200).json({
      data: {
        message: 'Successfully updated email',
        user: updatedUser,
        token,
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Route handler for updating a user's password
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - Next middleware
 */
async function updatePassword(req, res, next) {
  try {
    const { email } = req.user;
    const { currentPassword, newPassword } = req.body;
    // Fetch the password of the user
    const user = await userService.findUserByEmail(email);
    if (user.password) {
      if (!currentPassword) {
        return res.status(400).json({
          error: 'Invalid credentials',
        });
      }
      const match = await authHelper.comparePassword(currentPassword, user.password);
      if (!match) {
        return res.status(400).json({
          error: 'Invalid credentials',
        });
      }
    }

    const hashedPassword = await authHelper.generatePasswordHash(newPassword);
    await userService.resetPassword(email, hashedPassword);
    return res.status(200).json({
      data: {
        message: 'Successfully updated password',
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Route handler for retrieving cases a user has reported
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - Next middleware
 */
async function getUserCases(req, res, next) {
  const { id } = req.user;
  try {
    const userCases = await caseService.getCaseByUser(id);
    return res.status(200).json({
      data: {
        cases: userCases,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  updateUserProfile,
  getUserData,
  updateEmail,
  getUserCases,
  updatePassword,
};
