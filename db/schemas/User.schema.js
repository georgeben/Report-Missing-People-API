/* eslint-disable prefer-destructuring */
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

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
    required: true,
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
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  address: {
    type: String,
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
  let nameArr = this.fullname.split(' ');
  this.firstname = nameArr[0];
  this.lastname = nameArr[1];
  next();
});

module.exports = userSchema;
