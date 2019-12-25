const mongoose = require('mongoose');

const { Schema } = mongoose;

// TODO: I need a way to standardize locations

const newsletterSubscriptionSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
  },
  frequency: {
    type: String,
    enum: ['DAILY', 'WEEKLY'],
    required: true,
  },
  state: {
    type: String,
    default: 'all',
  },
  country: {
    type: String,
    default: 'all',
  },
}, { timestamps: true });

module.exports = newsletterSubscriptionSchema;
