const cloudinary = require('../config/cloudinary');

/**
 * Uploads an image to cloudinary
 * @param {String} path - The location where the image to be uploaded is stored on disk
 * @param {String} directory - The destination folder to store the image on cloudinary
 */
async function uploadImage(path, directory) {
  let image = await cloudinary.uploader.upload(path, {
    folder: `report_missing_people/${directory}/`,
    width: 520,
    crop: 'scale',
  });
  return image;
}

/**
 * Deletes an uploaded image from cloudinary
 * @param {String} public_id - The public id of the image to delete
 */
async function deleteImage(public_id) {
  const result = await cloudinary.uploader.destroy(public_id);
  return result;
}

module.exports = {
  uploadImage,
  deleteImage,
};
