const Joi = require('@hapi/joi');

const namePattern = /^[a-zA-Z]+$/;

module.exports = {
  signUp: Joi.object({
    fullname: Joi.string()
      .trim()
      .min(2)
      .required()
      .pattern(namePattern, 'letters'),
    firstname: Joi.string()
      .trim()
      .min(2)
      .pattern(namePattern, 'letters'),
    lastname: Joi.string()
      .trim()
      .min(2)
      .pattern(namePattern, 'letters'),
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
};
