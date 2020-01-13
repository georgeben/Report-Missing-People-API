const mongoose = require('mongoose');

const locationSchema = require('./Location.Schema');

const { Schema } = mongoose;


const newsletterSubscriptionSchema = new Schema(
  {
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
    address: {
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
  },
  { timestamps: true },
);

module.exports = newsletterSubscriptionSchema;
