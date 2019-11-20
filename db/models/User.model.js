const mongoose = require('mongoose');
const userSchema = require('../schemas/User.schema');

module.exports = mongoose.model('User', userSchema);