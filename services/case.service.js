const { CaseModel } = require('../db/models');

/**
 * @param {String} fullname - The name of the case
 * @returns {Object} existingCase - Details about the existing case if found
 */
async function findCaseByName(fullname) {
  let existingCase = await CaseModel.findOne({
    fullname,
  });
  return existingCase;
}

/**
 * @param {Object} caseData - Data about the new case
 * @returns {Object} newCase - The newly created case
 */
async function createCase(caseData) {
  let newCase = new CaseModel(caseData);
  console.log('In service', newCase.fullname);
  newCase = await newCase.save();
  return newCase;
}

/**
 * @param {Object} caseData - Information about a case
 * @returns {Boolean} - Represents if the case is a duplicate or not
 */
async function checkForDuplicateCase(caseData) {
  /* For a case to be a duplicate, I think it should have the same fullname,
  and it must be reported by the same person */
  let existingCase = await findCaseByName(caseData.fullname);
  if (!existingCase) return false;
  return existingCase.reportedBy.toString() === caseData.reportedBy;
}

module.exports = {
  createCase,
  checkForDuplicateCase,
};
