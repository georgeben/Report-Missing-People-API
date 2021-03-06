/* eslint-disable consistent-return */
/* eslint-disable func-names */
const mongoose = require('mongoose');
const caseSchema = require('../schemas/Case.schema');
const { processNewCaseEvent, processCaseUpdateEvent } = require('../../background-jobs');

caseSchema.pre('save', function (next) {
  this.firstTimeSave = this.isNew;
  this.changedFields = this.modifiedPaths();

  // Generate a description of the case
  let description = `${this.fullname} ${this.nicknames.length > 0 ? `aka ${this.nicknames.join(',')}` : ''}`;
  description += ` who is a ${this.age} year old ${this.gender.toLowerCase()} got missing on ${this.dateLastSeen.toDateString()} at ${this.addressLastSeen.formatted_address}, in ${this.addressLastSeen.state}, ${this.addressLastSeen.country}.`;

  this.description = description;
  next();
});

caseSchema.post('save', function (caseData) {
  if (this.firstTimeSave) {
    // If it is a new case start job to send case data to algolia and tweet the case
    return processNewCaseEvent(caseData);
  }
  processCaseUpdateEvent(caseData);
});

module.exports = mongoose.model('Case', caseSchema);
