const { caseService, newsletterService } = require('../services');

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
