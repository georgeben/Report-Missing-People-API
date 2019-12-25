const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
/**
 * Validates incoming requests
 * @param {Object} schema - The Joi schema to validate request against
 * @param {*} property - The property of the request to check e.g body, params, query
 */
function validate(schema, property = 'body') {
  return (req, res, next) => {
    // Convert JSON strings to objects because I am to lazy to add
    // a string - object coersion extension
    if (req.body.residentialAddress) {
      if (typeof (req[property].residentialAddress) === 'string') {
        // Convert it to an object
        req[property].residentialAddress = JSON.parse(
          req[property].residentialAddress,
        );
      }
    }

    if (req.body.addressLastSeen) {
      if (typeof req[property].addressLastSeen === 'string') {
        // Convert it to an object
        req[property].addressLastSeen = JSON.parse(
          req[property].addressLastSeen,
        );
      }
    }

    if (req.body.physicalInformation) {
      if (typeof (req.body.physicalInformation) === 'string') {
        req.body.physicalInformation = JSON.parse(req.body.physicalInformation);
      }
    }

    if (req.body.nicknames) {
      if (typeof (req.body.nicknames) === 'string') {
        req.body.nicknames = JSON.parse(req.body.nicknames);
      }
    }
    const { error } = schema.validate(req[property], { allowUnknown: true });
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
