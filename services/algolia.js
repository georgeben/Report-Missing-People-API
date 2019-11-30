const algolia = require('algoliasearch');

const client = algolia(process.env.ALGOLIA_APPID, process.env.ALGOLIA_APIKEY);
const casesIndex = client.initIndex(process.env.CASE_INDEX || 'dev_CASES');

/**
 * Adds a new object to the algolia index
 * @param {Objet} data - The new object to add to the algolia index
 */
async function addObject(data) {
  try {
    const algoliaObject = { ...data.toJSON() };
    algoliaObject.objectID = data._id;
    await casesIndex.addObject(data);
  } catch (error) {
    // TODO: How to handle error when an algolia operation fails
    console.log(error);
  }
}

/**
 * Updates an existing object in the algolia index
 * @param {Object} data - The existing object to update
 */
async function updateObject(data) {
  try {
    const algoliaObject = {};
    data.changedFields.forEach((item) => {
      algoliaObject[item] = data[item];
    });
    algoliaObject.objectID = data._id.toString();
    await casesIndex.partialUpdateObject(algoliaObject);
  } catch (error) {
    console.log({ error });
  }
}

module.exports = {
  addObject,
  updateObject,
};
