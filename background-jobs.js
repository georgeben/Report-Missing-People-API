const constants = require('./constants');

const { jobQueue, twitterQueue} = require('./createQueue');

/**
 * Places a confirm email job on the background queue
 * @param {String} email - The email to send the mail to
 */
async function processConfirmEmail(email) {
  jobQueue.add(constants.JOB_NAMES.CONFIRM_EMAIL, { email }, { attempts: 2 });
}

/**
 * Places a forgot password email job on the background queue
 * @param {String} email - The email to send the mail to
 */
async function processForgotPasswordMail(email) {
  jobQueue.add(constants.JOB_NAMES.FORGOT_PASSWORD_MAIL, { email });
}

/**
 * Places a message from a user via the contact us form on the background queue
 * @param {Object} data - The contact details
 */
async function processContactMessage(data) {
  jobQueue.add(constants.JOB_NAMES.CONTACT_US_MESSAGE, { data }, { attempts: 2 });
}

/**
 * Places a newsletter acknowledgement email job on the background queue
 * @param {String} email - The email to send the mail to
 */
async function processNewsletterAcknowledgementEmail(email) {
  jobQueue.add(constants.JOB_NAMES.NEWSLETTER_ACKNOWLEDGEMENT_EMAIL, { email }, { attempts: 2 });
}

/**
 * Places events that should occur anytime a new case is created on the background
 * queue
 * @param {Object} caseData - The data about the newly created case
 */
async function processNewCaseEvent(caseData) {
  /**
    When a new case is created, the case is added to the algolia case index
   */
  jobQueue.add(constants.JOB_NAMES.ADD_NEW_CASE, { caseData }, { attempts: 3 });
  twitterQueue.add(constants.JOB_NAMES.TWEET_NEW_CASE, { caseData }, { attempts: 2 });
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
  jobQueue.add(constants.JOB_NAMES.UPDATE_CASE, { caseData: { ...caseData } }, { attempts: 3 });
}

/**
 * Places the daily newsletter emails on the background queue
 */
async function processDailyNewsletterEmail(subscribers, reportedCases) {
  jobQueue.add(constants.JOB_NAMES.DAILY_NEWSLETTER, {
    subscribers,
    reportedCases,
  },
  {
    attempts: 3,
  });
}

/**
 * Places the daily newsletter emails on the background queue
 */
async function processWeeklyNewsletterEmail(subscribers, reportedCases) {
  jobQueue.add(constants.JOB_NAMES.WEEKLY_NEWSLETTER, {
    subscribers,
    reportedCases,
  },
  {
    attempts: 3,
  });
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
