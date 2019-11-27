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
 * Route handler for retrieving a reported case
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

/**
 * Route handler for updating a reported case
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - Next middleware
 */
async function updateCase(req, res, next) {
  const { slug } = req.params;
  const { id } = req.user;
  const caseData = req.body;
  try {
    let reportedCase = await caseService.findCaseBySlug(slug);

    // Check that the case exists
    if (!reportedCase) {
      return res.status(404).json({
        error: 'Case not found',
      });
    }
    // Ensure that the person trying to update it created it
    if (reportedCase.reportedBy.toString() !== id) {
      return res.status(403).json({
        error: 'Operation not permitted',
      });
    }

    // Update the case
    let updatedCase = await caseService.updateCase(slug, caseData);
    return res.status(200).json({
      data: {
        case: updatedCase,
      },
    });
  } catch (error) {
    console.log(error);
    // TODO: Handle error
  }
}

module.exports = {
  createCase,
  getCases,
  getSingleCase,
  updateCase,
};