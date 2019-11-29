const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
/**
 * Validates incoming requests
 * @param {Object} schema - The Joi schema to validate request against
 * @param {*} property - The property of the request to check e.g body, params, query
 */
function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error === undefined) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');
      if (req.file) fs.unlinkAsync(req.file.path);
      return res.status(422).json({
        error: message,
      });
    }
  };
}

module.exports = validate;
