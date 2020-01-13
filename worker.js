require('dotenv').config();
require('./config/sentry');
const { logger } = require('./utils');
const constants = require('./constants');
const { jobQueue, twitterQueue } = require('./createQueue');

const emailService = require('./services/email.service');
const algoliaService = require('./services/algolia');
const newsletterService = require('./services/newslettersubscription.service');
const twitterBot = require('./services/twitterbot');

logger.log('info', 'Workers ready 🔥🔥🔥');

/**
 * Job handler for sending confirmation emails
 */
jobQueue.process(constants.JOB_NAMES.CONFIRM_EMAIL, 50, async (job, done) => {
  logger.log('info', `📧Received ${job.name}#${job.id}`);
  // Send confirmation email
  const { email } = job.data;
  await emailService.sendConfirmationEmail(email);
  done();
});

/**
 * Job handler for forgot password emails
 */
jobQueue.process(constants.JOB_NAMES.FORGOT_PASSWORD_MAIL, 30, async (job, done) => {
  logger.log('info', `📧Received ${job.name}#${job.id}`);
  const { email } = job.data;
  await emailService.sendForgotPasswordMail(email);
  done();
});

/**
 * Job handler for messages sent via the contact us form
 */
jobQueue.process(constants.JOB_NAMES.CONTACT_US_MESSAGE, 30, async (job, done) => {
  logger.log('info', `📧Received ${job.name}#${job.id}`);
  const { data } = job.data;
  await emailService.sendContactUsMessage(data);
  done();
});

/**
 * Job handler for sending newsletter acknowledgement emails
 */
jobQueue.process(
  constants.JOB_NAMES.NEWSLETTER_ACKNOWLEDGEMENT_EMAIL,
  50,
  async (job, done) => {
    const { email } = job.data;
    logger.log('info', `📧Received ${job.name}#${job.id} to ${email}`);
    // Send newsletter acknowledgement email
    await emailService.sendNewsletterAcknowledgementEmail(email);
    done();
  },
);

jobQueue.on('active', (job) => {
  logger.log('info', `📧Job ${job.name}#${job.id} is now active 🚁🚁🚁`);
});

jobQueue.on('completed', (job, result) => {
  logger.log(
    'info',
    `📧Job ${job.name}#${job.id} is completed 🚀🚀`,
    result,
  );
});

jobQueue.on('stalled', (job) => {
  logger.log('info', `📧Job ${job.name}#${job.id} is stalled 😰😰`);
});

jobQueue.on('failed', (job, error) => {
  logger.log('error', `📧Job ${job.name}#${job.id} has failed 😭😭`, error);
});

/**
 * Job handler for adding new cases to algolia
 */
jobQueue.process(constants.JOB_NAMES.ADD_NEW_CASE, 50, async (job, done) => {
  const { caseData } = job.data;
  logger.log(
    'info',
    `🔍Received ${job.name}#${job.id} to ${caseData.fullname}`,
  );
  // Add the new case to the algolia index
  await algoliaService.addObject(caseData);
  done();
});

/**
 * Job handler for updating cases in algolia index
 */
jobQueue.process(constants.JOB_NAMES.UPDATE_CASE, 50, async (job, done) => {
  const { caseData } = job.data;
  logger.log('info', `🔍Received ${job.name}#${job.id}, ${caseData.fullname}`);
  await algoliaService.updateObject(caseData);
  done();
});

/**
 * Job handler for sending daily news letters
 */
jobQueue.process(constants.JOB_NAMES.DAILY_NEWSLETTER, 50, async (job, done) => {
  logger.log('info', `📰Received ${job.name}#${job.id}`);
  const { subscribers, reportedCases } = job.data;
  // Call a service to send out the daily newsletters
  newsletterService.processNewsletters(subscribers, reportedCases, 'DAILY');

  done();
});

jobQueue.process(constants.JOB_NAMES.WEEKLY_NEWSLETTER, 50, async (job, done) => {
  logger.log('info', `📰Received ${job.name}#${job.id}`);
  const { subscribers, reportedCases } = job.data;
  newsletterService.processNewsletters(subscribers, reportedCases, 'WEEKLY');
  done();
});

twitterQueue.process(
  constants.JOB_NAMES.TWEET_NEW_CASE,
  30,
  async (job, done) => {
    logger.log('info', `🐦Received ${job.name}#${job.id}`);
    const { caseData } = job.data;
    twitterBot.tweetNewCase(caseData);
    done();
  },
);

twitterQueue.on('active', (job) => {
  logger.log('info', `📧Job ${job.name}#${job.id} is now active 🚁🚁🚁`);
});

twitterQueue.on('completed', (job, result) => {
  logger.log(
    'info',
    `📧Job ${job.name}#${job.id} is completed 🚀🚀`,
    result,
  );
});

process.on('SIGTERM', () => {
  jobQueue.close().then(() => {
    logger.log('info', 'Closed queue');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  jobQueue.close().then(() => {
    logger.log('info', 'Closed queue');
    process.exit(0);
  });
});
