const mongoose = require('mongoose');

const { Schema } = mongoose;

const locationSchema = new Schema({
  type: {
    type: String,
  },
  coordinates: [Number], // An array storing the longitude and latitude
});

module.exports = locationSchema;
