const Bull = require('bull');
const constants = require('./constants');

const emailQueue = new Bull('email-worker');

async function processConfirmEmail(email) {
  emailQueue.add(constants.JOB_NAMES.CONFIRM_EMAIL, { email });
}

async function processNewsletterAcknowledgementEmail(email) {
  emailQueue.add(constants.JOB_NAMES.NEWSLETTER_ACKNOWLEDGEMENT_EMAIL, { email });
}

module.exports = {
  processConfirmEmail,
  processNewsletterAcknowledgementEmail,
};
