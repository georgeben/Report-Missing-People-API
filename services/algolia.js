/* eslint-disable consistent-return */
/**
 * Contains helper methods for communicating with the Algolia API https://www.algolia.com/
 */
const algolia = require('algoliasearch');
const { logger, handleError } = require('../utils');
const { algoliaIndex } = require('../config')();

// Create an algolia client
const client = algolia(process.env.ALGOLIA_APPID, process.env.ALGOLIA_APIKEY);
// Create an algolia index
const casesIndex = client.initIndex(algoliaIndex);

/**
 * Adds a new object to the algolia index
 * @param {Objet} data - The new object to add to the algolia index
 */
async function addObject(data) {
  try {
    const algoliaObject = { ...data };
    algoliaObject.objectID = data._id;
    await casesIndex.addObject(algoliaObject);
  } catch (error) {
    logger.log('error', `Failed to add object ${data._id} to algolia`, error);
    return handleError(error);
  }
}

/**
 * Updates an existing object in the algolia index
 * @param {Object} data - The existing object to update
 */
async function updateObject(data) {
  const { changedFields } = data;
  const caseData = data._doc;
  try {
    const algoliaObject = {};
    changedFields.forEach((item) => {
      algoliaObject[item] = caseData[item];
    });
    algoliaObject.objectID = caseData._id.toString();
    algoliaObject.slug = caseData.slug;
    await casesIndex.partialUpdateObject(algoliaObject);
  } catch (error) {
    logger.log('error', `Failed to update object ${caseData._id} to algolia`, error);
    return handleError(error);
  }
}

module.exports = {
  addObject,
  updateObject,
};
