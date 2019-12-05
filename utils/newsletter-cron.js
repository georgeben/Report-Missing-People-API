const cron = require('node-cron');
const moment = require('moment');
const { newsletterService, caseService } = require('../services');
const { processDailyNewsletterEmail } = require('../background-jobs');
const logger = require('./logger');

/**
 * Cron job for sending out daily newsletters at 8am
 */
cron.schedule('0 8 * * *', async () => {
  logger.log('info', 'Running cron job');
  const dailySubscribers = await newsletterService.getDailySubscribers();
  const startDate = moment().subtract(1, 'days').toDate();

  // Fetch all the case that where reported starting from start date
  let casesReportedFromPastDay = await caseService.getCasesFromDate(startDate);
  processDailyNewsletterEmail(dailySubscribers, casesReportedFromPastDay);
});
