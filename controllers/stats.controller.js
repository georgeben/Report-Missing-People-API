const { caseService, newsletterService } = require('../services');

/**
 * Route handler for fetching app statistics
 * @param {Object} req - The incoming request
 * @param {Object} res - The server response
 * @param {Function} next - The next middleware
 */
async function getStats(req, res, next) {
  try {
    const countryCount = await newsletterService.getCountryCount();
    const subscribersCount = await newsletterService.getSubscriberCount();
    const reportedCasesCount = await caseService.getCaseCount();

    return res.status(200).json({
      data: {
        countryCount,
        subscribersCount,
        reportedCasesCount,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getStats,
};
