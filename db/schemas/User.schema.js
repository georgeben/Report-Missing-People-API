/* eslint-disable prefer-destructuring */
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const locationSchema = require('./Location.Schema');

mongoose.plugin(slug);

const { Schema } = mongoose;

const userSchema = new Schema({
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
  email: {
    type: String,
    lowercase: true,
  },
  slug: {
    type: String,
    slug: 'fullname',
    slug_padding_size: 4,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  photoURL: {
    type: String,
    default: 'https://p7.hiclipart.com/preview/419/473/131/computer-icons-user-profile-login-user.jpg',
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
  cloudinaryPhotoID: {
    type: String,
  },
  googleID: {
    type: String,
    required: false,
  },
  facebookID: {
    type: String,
    required: false,
  },
  twitterID: {
    type: String,
    required: false,
  },
  completedProfile: {
    type: Boolean,
    default: false,
  },
  verifiedEmail: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

userSchema.pre('save', function (next) {
  const nameArr = this.fullname.split(' ');
  this.firstname = nameArr[0];
  this.lastname = nameArr[1];

  // Check if the profile is complete
  if (this.verifiedEmail) {
    if (this.residentialAddress.formatted_address) {
      // The profile is complete
      this.completedProfile = true;
    }
  } else {
    this.completedProfile = false;
  }
  next();
});

module.exports = userSchema;
