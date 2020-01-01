/* eslint-disable radix */
const { CaseModel } = require('../db/models');

/**
 * @param {String} fullname - The name of the case
 * @returns {Object} existingCase - Details about the existing case if found
 */
async function findCaseByName(fullname) {
  const existingCase = await CaseModel.findOne({
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
  const existingCase = await findCaseByName(caseData.fullname);
  if (!existingCase) return false;
  return existingCase.reportedBy.toString() === caseData.reportedBy;
}

/**
 * Retrieves the list of reported cases
 * @param {String} status - The status of the case: open, close or all
 * @param {Number} offset - The number of documents to skip
 * @param {Number} limit - The maximum number of documents to retrieve
 * @param {Object} ipInfo - The user's location information
 * @returns {Array} cases - The list of reported cases
 */
async function getCases(status, offset = 0, limit = 15, ipInfo) {
  let cases;
  let query = {};
  switch (status) {
    case 'all':
      break;
    case 'closed':
      query.solved = true;
      break;
    default:
      query.solved = false;
      break;
  }

  if (ipInfo) {
    query = {
      ...query,
      'addressLastSeen.location': {
        $near: {
          $geometry:
          {
            type: 'Point',
            coordinates: [ipInfo.ll[1], ipInfo.ll[0]],
          },
        },
      },
    };
  }

  cases = await CaseModel.find(query)
    .skip(parseInt(offset))
    .limit(parseInt(limit))
    .lean();

  return cases;
}

/**
 * Retrieves the list of reported cases from a given date till present
 * @param {Date} startData - The date to start from
 * @returns {Array} cases - The list of reported cases between the specified date range
 */
async function getCasesFromDate(startDate) {
  const cases = await CaseModel.find({
    createdAt: {
      $gt: startDate,
    },
  }).lean();
  return cases;
}

async function getCaseByUser(id) {
  const cases = await CaseModel.find({
    reportedBy: id,
  }).sort({
    updatedAt: -1,
  });
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
    cloudinaryPhotoID,
    eventCircumstances,
    physicalInformation,
    lastSeenClothing,
    solved,
  },
) {
  // TODO: Refactor this method
  const reportedCase = await findCaseBySlug(slug);
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
  if (cloudinaryPhotoID) reportedCase.cloudinaryPhotoID = cloudinaryPhotoID;
  if (eventCircumstances) reportedCase.eventDescription = eventCircumstances;
  if (physicalInformation) reportedCase.physicalInformation = physicalInformation;
  if (lastSeenClothing) reportedCase.lastSeenClothing = lastSeenClothing;
  if (solved) reportedCase.solved = solved;

  const updatedCase = await reportedCase.save();
  return updatedCase;
}

module.exports = {
  createCase,
  checkForDuplicateCase,
  getCases,
  findCaseBySlug,
  updateCase,
  getCasesFromDate,
  getCaseByUser,
};
