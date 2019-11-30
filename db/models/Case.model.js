const mongoose = require('mongoose');
const caseSchema = require('../schemas/Case.schema');

/**
 * This starts background services that run when a case is newly created or updated
 * @param {Object} caseData - The data of the saved case
 */
async function processNewCaseEvent(caseData) {
  // FIXME: Figure out why algoliaService is undefined when declared out of this function's scope
  const { algoliaService } = require('../../services');

  // If the case is new, tweet the case, and add it to the algolia index
  // If the case is being updated, update the algolia index
  if (this.firstTimeSave) {
    // TODO: Start a background job Tweet about the new case
    // TODO: Start a background job to add the case to the algolia index

    // FIXME: It should start a background job.
    algoliaService.addObject(caseData);
  } else {
    // TODO: Start a background job to update the algolia index with the updated data
    algoliaService.updateObject(caseData);
  }
}

caseSchema.pre('save', function (next) {
  this.firstTimeSave = this.isNew;
  this.changedFields = this.modifiedPaths();

  let description = `${this.fullname} ${this.nicknames.length > 0 ? `aka ${this.nicknames.join(',')}` : ''}`;
  description += ` who is a ${this.age} year old got missing on ${this.dateLastSeen.toString()} at ${this.addressLastSeen}, in ${this.state}, ${this.country}.`;
  if (this.physicalInformation && this.physicalInformation.height) {
    description += `${this.fullname}  is about ${this.physicalInformation.height} tall`;
    if (this.physicalInformation.weight) {
      description += `, and is weights about ${this.physicalInformation.weight} kg`;
    }
  }

  this.description = description;
  next();
});
caseSchema.post('save', processNewCaseEvent);

module.exports = mongoose.model('Case', caseSchema);
