/* eslint-disable prefer-destructuring */
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

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
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['MALE', 'FEMALE', 'BISEXUAL', 'OTHER'],
    },
    language: {
      type: String,
      required: true,
    },
    addressLastSeen: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    dateLastSeen: {
      type: Date,
      required: true,
    },
    photoURL: {
      type: String,
      required: true,
    },
    cloudinaryPhotoID: {
      type: String,
      required: true,
    },
    eventDescription: {
      type: String,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    physicalInformation: {
      description: {
        type: String,
      },
      height: {
        type: Number,
      },
      weight: {
        type: Number,
      },
      lastSeenClothing: {
        type: String,
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

// TODO: Create a pre-save hook to save firstname and lastname fields

module.exports = caseSchema;
