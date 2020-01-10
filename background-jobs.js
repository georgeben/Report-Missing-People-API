const Bull = require('bull');
const constants = require('./constants');

const emailQueue = new Bull('email-worker', process.env.REDIS_URL);
const algoliaQueue = new Bull(
  constants.WORKERS.ALGOLIA_WORKER,
  process.env.REDIS_URL,
);
const newsletterQueue = new Bull(
  constants.WORKERS.NEWSLETTER_WORKER,
  process.env.REDIS_URL,
);
const twitterQueue = new Bull(
  constants.WORKERS.TWITTER_BOT,
  process.env.REDIS_URL,
);

/**
 * Places a confirm email job on the background queue
 * @param {String} email - The email to send the mail to
 */
async function processConfirmEmail(email) {
  emailQueue.add(constants.JOB_NAMES.CONFIRM_EMAIL, { email });
}

/**
 * Places a forgot password email job on the background queue
 * @param {String} email - The email to send the mail to
 */
async function processForgotPasswordMail(email) {
  emailQueue.add(constants.JOB_NAMES.FORGOT_PASSWORD_MAIL, { email });
}

/**
 * Places a message from a user via the contact us form on the background queue
 * @param {Object} data - The contact details
 */
async function processContactMessage(data) {
  emailQueue.add(constants.JOB_NAMES.CONTACT_US_MESSAGE, { data });
}

/**
 * Places a newsletter acknowledgement email job on the background queue
 * @param {String} email - The email to send the mail to
 */
async function processNewsletterAcknowledgementEmail(email) {
  emailQueue.add(constants.JOB_NAMES.NEWSLETTER_ACKNOWLEDGEMENT_EMAIL, { email });
}

/**
 * Places events that should occur anytime a new case is created on the background
 * queue
 * @param {Object} caseData - The data about the newly created case
 */
async function processNewCaseEvent(caseData) {
  /* When a new case is created, the case is added to the algolia case index,
   * and the case is posted on Twitter
   */
  twitterQueue.add(constants.JOB_NAMES.TWEET_NEWCASE, { caseData });
  algoliaQueue.add(constants.JOB_NAMES.ADD_NEW_CASE, { caseData });
}

/**
 * Places events that should occur anytime a case is updated on the background
 * queue
 * @param {Object} caseData - The data about the updated case
 */
async function processCaseUpdateEvent(caseData) {
  /**
   * When a case is updated, the algolia case index should also be updated with
   * the latest case information
   */
  algoliaQueue.add(constants.JOB_NAMES.UPDATE_CASE, { caseData: { ...caseData } });
}

/**
 * Places the daily newsletter emails on the background queue
 */
async function processDailyNewsletterEmail(subscribers, reportedCases) {
  newsletterQueue.add(constants.JOB_NAMES.DAILY_NEWSLETTER, { subscribers, reportedCases });
}

/**
 * Places the daily newsletter emails on the background queue
 */
async function processWeeklyNewsletterEmail(subscribers, reportedCases) {
  newsletterQueue.add(constants.JOB_NAMES.WEEKLY_NEWSLETTER, { subscribers, reportedCases });
}

module.exports = {
  processConfirmEmail,
  processForgotPasswordMail,
  processNewsletterAcknowledgementEmail,
  processNewCaseEvent,
  processCaseUpdateEvent,
  processDailyNewsletterEmail,
  processWeeklyNewsletterEmail,
  processContactMessage,
};
