const mongoose = require('mongoose');
const caseSchema = require('../schemas/Case.schema');

module.exports = mongoose.model('Case', caseSchema);
