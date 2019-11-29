const multer = require('multer');

const maxFileSize = (1 * 1024 * 1024);

const storage = multer.diskStorage({
  destination: 'temp/uploads/',
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${new Date()}-${file.originalname}`);
  },
});

function fileFilter(req, file, cb) {
  if (!(file.mimetype.match(/jpeg|jpg|png|gif$i/))) {
    cb(new Error('File is not supported'), false);
    return;
  }
  cb(null, true);
}

/**
 * Returns a middleware for parsing multipart/form-data requests
 * @param {String} fieldname - The name if the field that contains the image
 */
module.exports = (fieldname) => {
  return (req, res, next) => {
    const upload = multer({
      storage,
      fileFilter,
      limits: { fileSize: maxFileSize },
    }).single(fieldname);
    upload(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          error: error.message,
        });
      }
      next();
    });
  };
};
