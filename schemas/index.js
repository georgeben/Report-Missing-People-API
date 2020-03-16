/**
 * Schemas for validating API request data
 */
// TODO Break this file into smaller ones
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
  verifyToken: Joi.object({
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
      .required(),
    nicknames: Joi.array().items(Joi.string()),
    age: Joi.number()
      .integer()
      .min(1),
    residentialAddress: Joi.object({
      location: Joi.object({
        type: Joi.string()
          .trim(),
        coordinates: Joi.array()
          .items(Joi.number())
          .max(2),
      }),
      formatted_address: Joi.string()
        .trim().optional(),
      country: Joi.string()
        .trim(),
      state: Joi.string()
        .trim(),
    }).optional(),
    gender: Joi.string()
      .trim()
      .required()
      .valid('MALE', 'FEMALE'),
    language: Joi.string()
      .trim()
      .pattern(namePattern, 'name'),
    addressLastSeen: Joi.object({
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
    }).required(),
    dateLastSeen: Joi.date()
      .required()
      .max('now'),
    lastSeenClothing: Joi.string().trim(),
    eventCircumstances: Joi.string().trim(),
    physicalInformation: Joi.object({
      specialCharacteristics: Joi.string().trim(),
      height: Joi.number()
        .positive()
        .min(0.1)
        .precision(3),
      weight: Joi.number().integer(),
      healthInformation: Joi.string().trim(),
    }),
  }),
  updateCase: Joi.object({
    fullname: Joi.string()
      .trim()
      .min(3),
    nicknames: Joi.array().items(Joi.string()),
    age: Joi.number()
      .integer()
      .min(1),
    gender: Joi.string()
      .trim()
      .valid('MALE', 'FEMALE'),
    language: Joi.string()
      .trim()
      .pattern(namePattern, 'name'),
    residentialAddress: Joi.object({
      location: Joi.object({
        type: Joi.string()
          .trim(),
        coordinates: Joi.array()
          .items(Joi.number())
          .max(2),
      }),
      formatted_address: Joi.string()
        .trim().optional(),
      country: Joi.string()
        .trim(),
      state: Joi.string()
        .trim(),
    }).optional(),
    addressLastSeen: Joi.object({
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
    dateLastSeen: Joi.date().max('now'),
    lastSeenClothing: Joi.string().trim(),
    eventCircumstances: Joi.string().trim(),
    physicalInformation: Joi.object({
      specialCharacteristics: Joi.string().trim(),
      height: Joi.number()
        .positive()
        .min(0.1)
        .precision(3),
      weight: Joi.number().integer(),
      healthInformation: Joi.string().trim(),
    }),
  }),
  newsletterSubscription: Joi.object({
    email: Joi.string()
      .trim()
      .email({ minDomainSegments: 2 })
      .required(),
    frequency: Joi.string()
      .trim()
      .valid('DAILY', 'WEEKLY')
      .required(),
    address: Joi.object({
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
  updateNewsletterSubscription: Joi.object({
    newEmail: Joi.string()
      .trim()
      .email({ minDomainSegments: 2 }),
    frequency: Joi.string()
      .trim()
      .valid('DAILY', 'WEEKLY'),
    address: Joi.object({
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
  updateEmail: Joi.object({
    email: Joi.string()
      .trim()
      .email({ minDomainSegments: 2 }),
  }),
  updatePassword: Joi.object({
    currentPassword: Joi.string().min(4),
    newPassword: Joi.string()
      .min(4)
      .required(),
  }),
  checkForEmail: Joi.object({
    email: Joi.string()
      .trim()
      .email({ minDomainSegments: 2 })
      .required(),
  }),
  contactMessage: Joi.object({
    email: Joi.string()
      .trim()
      .email({ minDomainSegments: 2 })
      .required(),
    fullname: Joi.string()
      .trim()
      .min(2)
      .required(),
    message: Joi.string()
      .trim()
      .min(20)
      .required(),
  }),
};
