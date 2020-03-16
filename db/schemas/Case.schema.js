/* eslint-disable prefer-destructuring */
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const locationSchema = require('./Location.Schema');

mongoose.plugin(slug);

const { Schema } = mongoose;

const caseSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    slug: {
      type: String,
      slug: 'fullname',
      slug_padding_size: 4,
      unique: true,
    },
    nicknames: [String],
    age: {
      type: Number,
    },
    gender: {
      type: String,
      required: true,
      enum: ['MALE', 'FEMALE'],
    },
    language: {
      type: String,
    },
    residentialAddress: {
      location: locationSchema,
      formatted_address: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    addressLastSeen: {
      location: locationSchema,
      formatted_address: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    dateLastSeen: {
      type: Date,
      required: true,
    },
    lastSeenClothing: {
      type: String,
    },
    photoURL: {
      type: String,
      required: true,
    },
    cloudinaryPhotoID: {
      type: String,
      required: true,
    },
    eventCircumstances: {
      type: String,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
    },
    physicalInformation: {
      specialCharacteristics: {
        type: String,
      },
      height: {
        type: Number,
      },
      weight: {
        type: Number,
      },
      healthInformation: {
        type: String,
      },
    },
    solved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = caseSchema;
