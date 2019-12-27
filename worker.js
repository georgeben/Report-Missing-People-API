const Bull = require('bull');
const { logger } = require('./utils');
const constants = require('./constants');
const {
  emailService,
  algoliaService,
  newsletterService,
  twitterBot,
} = require('./services');

logger.log('info', 'Workers ready 🔥🔥🔥');

const emailQueue = new Bull('email-worker');
const algoliaQueue = new Bull(constants.WORKERS.ALGOLIA_WORKER);
const newsletterQueue = new Bull(constants.WORKERS.NEWSLETTER_WORKER);
const twitterQueue = new Bull(constants.WORKERS.TWITTER_BOT);

/**
 * Job handler for sending confirmation emails
 */
emailQueue.process(constants.JOB_NAMES.CONFIRM_EMAIL, async (job, done) => {
  logger.log('info', `📧Received ${job.name}#${job.id}`);
  // Send confirmation email
  const { email } = job.data;
  await emailService.sendConfirmationEmail(email);
  done();
});

/**
 * Job handler for forgot password emails
 */
emailQueue.process(constants.JOB_NAMES.FORGOT_PASSWORD_MAIL, async (job, done) => {
  logger.log('info', `📧Received ${job.name}#${job.id}`);
  const { email } = job.data;
  await emailService.sendForgotPasswordMail(email);
  done();
});

/**
 * Job handler for sending newsletter acknowledgement emails
 */
emailQueue.process(
  constants.JOB_NAMES.NEWSLETTER_ACKNOWLEDGEMENT_EMAIL,
  async (job, done) => {
    const { email } = job.data;
    logger.log('info', `📧Received ${job.name}#${job.id} to ${email}`);
    // Send newsletter acknowledgement email
    await emailService.sendNewsletterAcknowledgementEmail(email);
    done();
  },
);

emailQueue.on('active', (job) => {
  logger.log('info', `📧Job ${job.name}#${job.id} is now active 🚁🚁🚁`);
});

emailQueue.on('completed', (job, result) => {
  const { email } = job.data;
  logger.log(
    'info',
    `📧Job ${job.name}#${job.id} to ${email} is completed 🚀🚀`,
    result,
  );
});

emailQueue.on('stalled', (job) => {
  logger.log('info', `📧Job ${job.name}#${job.id} is stalled 😰😰`);
});

emailQueue.on('failed', (job, error) => {
  logger.log('error', `📧Job ${job.name}#${job.id} has failed 😭😭`, error);
});

/**
 * Job handler for adding new cases to algolia
 */
algoliaQueue.process(constants.JOB_NAMES.ADD_NEW_CASE, async (job, done) => {
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
    `🔍Job ${job.name}#${job.id} is completed 🚀🚀`,
    result,
  );
});

algoliaQueue.on('stalled', (job) => {
  logger.log('info', `🔍Job ${job.name}#${job.id} is stalled 😰😰`);
});

algoliaQueue.on('failed', (job, error) => {
  logger.log('error', `🔍Job ${job.name}#${job.id} has failed 😭😭`, error);
});

/**
 * Job handler for sending daily news letters
 */
newsletterQueue.process(constants.JOB_NAMES.DAILY_NEWSLETTER, async (job, done) => {
  logger.log('info', `📰Received ${job.name}#${job.id}`);
  const { subscribers, reportedCases } = job.data;
  // Call a service to send out the daily newsletters
  newsletterService.processNewsletters(subscribers, reportedCases, 'DAILY');

  done();
});

newsletterQueue.process(constants.JOB_NAMES.WEEKLY_NEWSLETTER, async (job, done) => {
  logger.log('info', `📰Received ${job.name}#${job.id}`);
  const { subscribers, reportedCases } = job.data;
  newsletterService.processNewsletters(subscribers, reportedCases, 'WEEKLY');
  done();
});

// newsletterQueue.getActiveCount().then(num => console.log('Number of active jobs', num));

/* Delete all active jobs, in case the queue gets messed up
 * newsletterQueue.getActive().then(jobs => {
  jobs.forEach( job => {
    console.log(job.id);
     job.remove().then(res => console.log('Removed job'));
  });
}).catch(err => console.log(err)); */

// newsletterQueue.getDelayedCount().then(num => console.log('Number of delayed jobs', num));

newsletterQueue.on('active', (job) => {
  logger.log('info', `📰Job ${job.name}#${job.id} is now active 🚁🚁🚁`);
});

newsletterQueue.on('completed', (job, result) => {
  logger.log(
    'info',
    `📰Job ${job.name}#${job.id} is completed 🚀🚀`,
    result,
  );
});

newsletterQueue.on('stalled', (job) => {
  logger.log('info', `📰Job ${job.name}#${job.id} is stalled 😰😰`);
});

newsletterQueue.on('failed', (job, error) => {
  logger.log('error', `📰Job ${job.name}#${job.id} has failed 😭😭`, error);
});

/**
 * Job handler for tweeting new cases
 */
twitterQueue.process(constants.JOB_NAMES.TWEET_NEWCASE, async (job, done) => {
  logger.log('info', `🐦Received ${job.name}#${job.id}`);
  const { message } = job.data;
  twitterBot.tweetNewCase(message);

  done();
});

twitterQueue.on('active', (job) => {
  logger.log('info', `🐦Job ${job.name}#${job.id} is now active 🚁🚁🚁`);
});

twitterQueue.on('completed', (job, result) => {
  logger.log('info', `🐦Job ${job.name}#${job.id} is completed 🚀🚀`, result);
});

twitterQueue.on('stalled', (job) => {
  logger.log('info', `🐦Job ${job.name}#${job.id} is stalled 😰😰`);
});

twitterQueue.on('failed', (job, error) => {
  logger.log('error', `🐦Job ${job.name}#${job.id} has failed 😭😭`, error);
});
