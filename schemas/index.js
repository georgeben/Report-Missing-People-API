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
    fullname: Joi.string()
      .trim()
      .min(2)
      .pattern(fullnamePattern, 'Firstname Lastname'),
    residentialAddress: Joi.object({
      location: Joi.object({
        type: Joi.string()
          .trim()
          .required(),
        coordinates: Joi.array()
          .items(Joi.number())
          .max(2)
          .required(),
      }),
      formatted_address: Joi.string()
        .trim()
        .required(),
      country: Joi.string()
        .trim()
        .required(),
      state: Joi.string()
        .trim()
        .required(),
    }),
  }),
  checkForSlug: Joi.object({
    slug: Joi.string()
      .trim()
      .required()
      .pattern(slugPattern, 'slug-0000 or slug-slug0001'),
  }),
  createCase: Joi.object({
    fullname: Joi.string()
      .trim()
      .min(2)
      .required()
      .pattern(fullnamePattern, 'Firstname Lastname'),
    nicknames: Joi.array().items(Joi.string()),
    age: Joi.number()
      .integer()
      .min(1)
      .required(),
    gender: Joi.string()
      .trim()
      .required()
      .valid('MALE', 'FEMALE', 'BISEXUAL', 'OTHER'),
    language: Joi.string()
      .trim()
      .required()
      .pattern(namePattern, 'name'),
    addressLastSeen: Joi.string()
      .trim()
      .required(),
    country: Joi.string()
      .trim()
      .required(),
    state: Joi.string()
      .trim()
      .required(),
    dateLastSeen: Joi.date()
      .required()
      .max('now'),
    eventDescription: Joi.string().trim(),
    physicalInformation: Joi.object({
      description: Joi.string().trim(),
      height: Joi.number()
        .positive()
        .min(0.1)
        .precision(3),
      weight: Joi.number().integer(),
      lastSeenClothing: Joi.string().trim(),
      healthInformation: Joi.string().trim(),
    }),
  }),
  updateCase: Joi.object({
    fullname: Joi.string()
      .trim()
      .min(3)
      .pattern(fullnamePattern, 'Firstname Lastname'),
    nicknames: Joi.array().items(Joi.string()),
    age: Joi.number()
      .integer()
      .min(1),
    gender: Joi.string()
      .trim()
      .valid('MALE', 'FEMALE', 'BISEXUAL', 'OTHER'),
    language: Joi.string()
      .trim()
      .pattern(namePattern, 'name'),
    addressLastSeen: Joi.string().trim(),
    country: Joi.string().trim(),
    state: Joi.string().trim(),
    dateLastSeen: Joi.date().max('now'),
    eventDescription: Joi.string().trim(),
    physicalInformation: Joi.object({
      description: Joi.string().trim(),
      height: Joi.number()
        .positive()
        .min(0.1)
        .precision(3),
      weight: Joi.number().integer(),
      lastSeenClothing: Joi.string().trim(),
      healthInformation: Joi.string().trim(),
    }),
    solved: Joi.boolean(),
  })
    .with('country', 'state')
    .with('state', 'addressLastSeen'),
  newsletterSubscription: Joi.object({
    email: Joi.string()
      .trim()
      .email({ minDomainSegments: 2 })
      .required(),
    frequency: Joi.string()
      .trim()
      .valid('DAILY', 'WEEKLY')
      .required(),
    country: Joi.string().trim(),
    state: Joi.string().trim(),
  }).with('state', 'country'),
  updateNewsletterSubscription: Joi.object({
    newEmail: Joi.string()
      .trim()
      .email({ minDomainSegments: 2 }),
    frequency: Joi.string()
      .trim()
      .valid('DAILY', 'WEEKLY'),
    country: Joi.string().trim(),
    state: Joi.string().trim(),
  }).with('state', 'country'),
};
