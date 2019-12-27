const oauthService = require('./oauth.service');
const userService = require('./user.service');
const emailService = require('./email.service');
const caseService = require('./case.service');
const cloudinaryService = require('./cloudinary.service');
const algoliaService = require('./algolia');
const newsletterService = require('./newslettersubscription.service');
const twitterBot = require('./twitterbot');

module.exports = {
  oauthService,
  userService,
  emailService,
  caseService,
  cloudinaryService,
  algoliaService,
  newsletterService,
  twitterBot,
};
