const oauthService = require('./oauth.service');
const userService = require('./user.service');
const emailService = require('./email.service');
const caseService = require('./case.service');
const cloudinaryService = require('./cloudinary.service');
const newsletterService = require('./newslettersubscription.service');

module.exports = {
  oauthService,
  userService,
  emailService,
  caseService,
  cloudinaryService,
  newsletterService,
};
