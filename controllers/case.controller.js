const { caseService } = require('../services');

/**
 * Route handler for creating a case
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - Next middleware
 */
async function createCase(req, res, next) {
  // Get the case data
  let caseData = req.body;
  const { id } = req.user;
  try {
    caseData.reportedBy = id;
    const isDuplicate = await caseService.checkForDuplicateCase(caseData);
    if (isDuplicate) {
      return res.status(409).json({
        error: 'That case has already been reported',
      });
    }
    let createdCase = await caseService.createCase(caseData);
    createdCase = createdCase.toJSON();
    // TODO: Probably call a service to tweet the case

    res.status(201).json({
      data: {
        ...createdCase,
      },
    });

    // TODO: Send acknowledgement email to the user creating the case
  } catch (error) {
    console.log(error);
    // TODO: Handle error
  }
}

/**
 * Route handler for retrieving reported cases
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - Next middleware
 */
async function getCases(req, res, next) {
  const { status } = req.query;
  try {
    const cases = await caseService.getCases(status);
    return res.status(200).json({
      data: cases,
    });
  } catch (error) {
    console.log(error);
    // TODO: Handle error
  }
}

/**
 *cRoute handler for retrieving a reported case
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - Next middleware
 */
async function getSingleCase(req, res, next) {
  let { slug } = req.params;
  try {
    const reportedCase = await caseService.findCaseBySlug(slug);
    if (!reportedCase) {
      return res.status(404).json({
        error: 'Case not found',
      });
    }

    return res.status(200).json({
      data: {
        case: reportedCase,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createCase,
  getCases,
  getSingleCase,
};
