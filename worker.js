const Bull = require('bull');
const { logger } = require('./utils');
const constants = require('./constants');
const { emailService } = require('./services');

logger.log('info', 'Workers ready 🔥🔥🔥');

const emailQueue = new Bull('email-worker');

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
