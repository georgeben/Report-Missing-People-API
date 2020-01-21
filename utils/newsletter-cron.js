/**
 * Schedules newsletter daily and weekly emails
 */
const cron = require('node-cron');
const moment = require('moment');
const { newsletterService, caseService } = require('../services');
const { processDailyNewsletterEmail, processWeeklyNewsletterEmail } = require('../background-jobs');
const logger = require('./logger');

/**
 * Cron job for sending out daily newsletters at 8am
 */
cron.schedule('0 8 * * *', async () => {
  logger.log('info', 'Running daily newsletter cron job');
  const dailySubscribers = await newsletterService.getDailySubscribers();
  const startDate = moment().subtract(1, 'days').toDate();

  // Fetch all the case that where reported starting from start date
  const casesReportedFromPastDay = await caseService.getCasesFromDate(startDate);
  processDailyNewsletterEmail(dailySubscribers, casesReportedFromPastDay);
});

/**
 * Cron job for sending out weekly newsletters at 8am on Mondays
 */
cron.schedule('0 8 * * 1', async () => {
  logger.log('info', 'Running weekly newsletter cron job');
  const weeklySubscribers = await newsletterService.getWeeklySubscribers();
  const startDate = moment().subtract(7, 'days').toDate();

  // Fetch all the case that where reported starting from start date
  const casesReportedFromPastWeek = await caseService.getCasesFromDate(startDate);
  processWeeklyNewsletterEmail(weeklySubscribers, casesReportedFromPastWeek);
});
