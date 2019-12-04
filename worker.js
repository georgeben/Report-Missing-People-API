const Bull = require('bull');
const { logger } = require('./utils');
const constants = require('./constants');
const { emailService, algoliaService } = require('./services');

logger.log('info', 'Workers ready 🔥🔥🔥');

const emailQueue = new Bull('email-worker');
const algoliaQueue = new Bull(constants.WORKERS.ALGOLIA_WORKER);

emailQueue.process(constants.JOB_NAMES.CONFIRM_EMAIL, async (job, done) => {
  logger.log('info', `📧Received ${job.name}#${job.id}`);
  // Send confirmation email
  const { email } = job.data;
  await emailService.sendConfirmationEmail(email);
  done();
});

emailQueue.process(constants.JOB_NAMES.NEWSLETTER_ACKNOWLEDGEMENT_EMAIL, async (job, done) => {
  const { email } = job.data;
  logger.log('info', `📧Received ${job.name}#${job.id} to ${email}`);
  // Send newsletter acknowledgement email
  await emailService.sendNewsletterAcknowledgementEmail(email);
  done();
});

emailQueue.on('active', (job) => {
  logger.log('info', `📧Job ${job.name}#${job.id} is now active 🚁🚁🚁`);
});

emailQueue.on('completed', (job, result) => {
  const { email } = job.data;
  logger.log('info', `📧Job ${job.name}#${job.id} to ${email} is completed 🚀🚀`, result);
});

emailQueue.on('stalled', (job) => {
  logger.log('info', `📧Job ${job.name}#${job.id} is stalled 😰😰`);
});

emailQueue.on('failed', (job, error) => {
  logger.log('error', `📧Job ${job.name}#${job.id} has failed 😭😭`, error);
});

algoliaQueue.process(constants.JOB_NAMES.ADD_NEW_CASE, async (job, done) => {
  const { caseData } = job.data;
  logger.log('info', `🔍Received ${job.name}#${job.id} to ${caseData.fullname}`);
  // Add the new case to the algolia index
  await algoliaService.addObject(caseData);
  done();
});

algoliaQueue.process(constants.JOB_NAMES.UPDATE_CASE, async (job, done) => {
  const { caseData } = job.data;
  logger.log('info', `🔍Received ${job.name}#${job.id}, ${caseData.fullname}`);
  await algoliaService.updateObject(caseData);
  done();
});

algoliaQueue.on('active', (job) => {
  logger.log('info', `🔍Job ${job.name}#${job.id} is now active 🚁🚁🚁`);
});

algoliaQueue.on('completed', (job, result) => {
  const { email } = job.data;
  logger.log(
    'info',
    `🔍Job ${job.name}#${job.id} to ${email} is completed 🚀🚀`,
    result,
  );
});

algoliaQueue.on('stalled', job => {
  logger.log('info', `🔍Job ${job.name}#${job.id} is stalled 😰😰`);
});

algoliaQueue.on('failed', (job, error) => {
  logger.log('error', `🔍Job ${job.name}#${job.id} has failed 😭😭`, error);
});
