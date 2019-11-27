const Joi = require('@hapi/joi');

const namePattern = /^[a-zA-Z]+$/;
const fullnamePattern = /^([a-zA-Z]+\s{1}[a-zA-Z]+$)/;
const slugPattern = /^[a-z]+(?:-([a-z]+|[0-9]{4}|([a-z]+[0-9]{4})))*$/;

module.exports = {
  signUp: Joi.object({
    fullname: Joi.string()
      .trim()
      .min(2)
      .required()
      .pattern(fullnamePattern, 'Firstname Lastname'),
    firstname: Joi.string()
      .trim()
      .min(2)
      .pattern(namePattern, 'name'),
    lastname: Joi.string()
      .trim()
      .min(2)
      .pattern(namePattern, 'name'),
    email: Joi.string()
      .trim()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string()
      .trim()
      .min(4)
      .required(),
  }),
  logIn: Joi.object({
    email: Joi.string()
      .trim()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string()
      .trim()
      .min(4)
      .required(),
  }),
  verifyEmail: Joi.object({
    token: Joi.string()
      .trim()
      .required(),
  }),
  googleSignIn: Joi.object({
    id_token: Joi.string()
      .trim()
      .required(),
  }),
  updateUserProfile: Joi.object({
    profile: Joi.object({
      fullname: Joi.string()
        .trim()
        .min(2)
        .pattern(fullnamePattern, 'Firstname Lastname'),
      photoURL: Joi.string()
        .trim()
        .uri({ scheme: ['http', 'https'] }),
      country: Joi.string()
        .trim(),
      state: Joi.string()
        .trim(),
      address: Joi.string().trim(),
    })
      .required()
      .with('country', 'state')
      .with('state', 'address'),
  }),
  checkForSlug: Joi.object({
    slug: Joi.string()
      .trim()
      .required()
      .pattern(slugPattern, 'slug-0000 or slug-slug0001'),
  }),
};
