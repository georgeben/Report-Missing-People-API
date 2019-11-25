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

/**
 * Retrieves the list of reported cases
 * @param {String} status - The status of the case: open, close or all
 * @returns {Array} cases - The list of reported cases
 */
async function getCases(status) {
  let cases;
  switch (status) {
    case 'all':
      cases = await CaseModel.find().lean();
      break;
    case 'closed':
      cases = await CaseModel.find({ solved: true }).lean();
      break;
    default:
      cases = await CaseModel.find({ solved: false }).lean();
      break;
  }

  return cases;
}

/**
 * Retrieves information about a reported case
 * @param {String} slug - The case's slug
 * @returns {Object} reportedCase - Data about the case
 */
async function findCaseBySlug(slug) {
  const reportedCase = await CaseModel.findOne({ slug });
  return reportedCase;
}

/**
 * Updates a reported cases
 * @param {String} slug - The slug of the case to update
 * @param {Object} param1 - The updated data of the case
 */
async function updateCase(
  slug,
  {
    fullname,
    nicknames,
    age,
    gender,
    language,
    addressLastSeen,
    state,
    country,
    dateLastSeen,
    photoURL,
    eventDescription,
    physicalInformation,
    solved,
  }
) {
  // TODO: Refactor this method
  let reportedCase = await findCaseBySlug(slug);
  if (fullname) reportedCase.fullname = fullname;
  if (nicknames) reportedCase.nicknames = nicknames;
  if (age) reportedCase.age = age;
  if (gender) reportedCase.gender = gender;
  if (language) reportedCase.language = language;
  if (addressLastSeen) reportedCase.addressLastSeen = addressLastSeen;
  if (state) reportedCase.state = state;
  if (country) reportedCase.country = country;
  if (dateLastSeen) reportedCase.dateLastSeen = dateLastSeen;
  if (photoURL) reportedCase.photoURL = photoURL;
  if (eventDescription) reportedCase.eventDescription = eventDescription;
  if (physicalInformation) reportedCase.physicalInformation = physicalInformation;
  if (solved) reportedCase.solved = solved;

  let updatedCase = await reportedCase.save();
  return updatedCase;
}

module.exports = {
  createCase,
  checkForDuplicateCase,
  getCases,
  findCaseBySlug,
  updateCase,
};
