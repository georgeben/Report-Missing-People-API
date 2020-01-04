/* eslint-disable consistent-return */
const sgMail = require('@sendgrid/mail');
const { authHelper, handleError, logger } = require('../utils');
const constants = require('../constants');

let FRONTEND_URL;
if (process.env.NODE_ENV === 'production') {
  FRONTEND_URL = process.env.FRONTEND_URL;
} else {
  FRONTEND_URL = process.env.DEV_FRONTEND_URL;
}
const { BASE_URL } = process.env;

sgMail.setApiKey(process.env.SENDGRID_APIKEY);

/**
 * Returns the HTML for a given type of message
 * @param {String} type - The kind of email
 * @param {token} token - The token
 * @return { String} - The email HTML
 */
function getEmailHtml(type, token) {
  switch (type) {
    case 'confirm-email':
      return `<body style="font-family: sans-serif;">
                <div style="
                margin: auto;
                background-color: rgb(245, 245, 245);
                width: 650px;
                height: 400px;
                text-align: center;
                box-shadow: 0px 5px 15px 0px rgb(153, 153, 153, 0.5);
                border-radius: 8px;">
                <h4 style="color: rgb(93, 93, 93); font-size: 28px; padding-top: 40px;">Please confirm your email</h4>
                <p style="color: rgb(93, 93, 93); font-size: 17px;">Please confirm your account by clicking the button below, Ignore this message if you didn't request it</p>
                <a style="background-color: #FD297B; /* Green */
                        outline: none;
                        border-radius: 360px;
                        color: white;
                        margin-top: 10px;
                        padding: 15px 32px;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;" href='${FRONTEND_URL}/verify-email?token=${token}'>confirm email</a>
              </div>
              </body>`;
    case 'newsletter-acknowledgement':
      return `<body>
                <h2>You will start receiving emails now</h2>
                <p><a href='${BASE_URL}/api/v1/newsletter/?token=${token}'>Change email subscription settings</a></p>
              </body>
              `;
    case constants.EMAIL_TYPES.FORGOT_PASSWORD:
      return `
              <body>
                <p>Click this link to reset your password. <a href='${FRONTEND_URL}/auth/reset-password?token=${token}'>Reset password</a></p>
              </body>
              `;
    default:
      throw new Error('Email kind not found');
  }
}

/**
 * Sends an email to a user to confirm their email
 * @param {String} email - The email to send the mail to
 */
async function sendConfirmationEmail(email) {
  try {
    const token = await authHelper.signJWTToken(email);
    const msg = {
      to: email,
      from: 'no-reply@report-missing-people.com',
      subject: 'Confirmation Email',
      html: getEmailHtml(constants.EMAIL_TYPES.CONFIRM_EMAIL, token),
    };

    await sgMail.send(msg);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Sends an email to a user to reset their password
 * @param {String} email - The email to send the mail to
 */
async function sendForgotPasswordMail(email) {
  try {
    const token = await authHelper.signJWTToken({ email }, { expiresIn: '1h' });
    const msg = {
      to: email,
      from: constants.FROM_EMAIL,
      subject: 'Reset your password',
      html: getEmailHtml(constants.EMAIL_TYPES.FORGOT_PASSWORD, token),
    };

    await sgMail.send(msg);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Sends an acknowledgement email to users that have subscribed to newsletter
 * @param {String} email - The email to send the mail to
 */
async function sendNewsletterAcknowledgementEmail(email) {
  try {
    const token = await authHelper.signJWTToken({ email });
    const msg = {
      to: email,
      from: constants.FROM_EMAIL,
      subject: 'Thank you for subscribing to our newsletter',
      html: getEmailHtml(
        constants.EMAIL_TYPES.NEWSLETTER_ACKNOWLEDGEMENT,
        token,
      ),
    };

    await sgMail.send(msg);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Generates the HTML for a case when sending daily/weekly newsletters
 * @param {Object} caseData - Data about the case
 * @returns {String} HTML email markup of the case
 */
function getCaseHTML(caseData) {
  return `
    <div>
      <h1>${caseData.fullname}</h1>
      <img src='${caseData.photoURL}' alt='Image of missing person'>
      <p>${caseData.description}</p>
      <a href='${FRONTEND_URL}/cases/${caseData.slug}'>View case</a>
    </div>
  `;
}

/**
 * Sends a daily newsletter listing all the reported cases that have been reported
 * the past day
 * @param {String} email - The email to send the mail to
 * @param {Array} cases - The array of cases that have been reported since the past day
 */
async function sendNewsletter(emails, cases, type) {
  try {
    // const token = await authHelper.signJWTToken({ email });
    let html = `
      <h1>The following people got missing in your area</h1>
    `;
    for (let i = 0; i < cases.length; i += 1) {
      html += getCaseHTML(cases[i]);
    }
    let msg = {
      to: emails,
      from: constants.FROM_EMAIL,
      subject: `Reported cases of missing people for the past ${type === 'DAILY' ? 'day' : 'week'}`,
      html,
    };
    if (process.env.NODE_ENV !== 'production') {
      msg = {
        ...msg,
        mail_settings: {
          sandbox_mode: {
            enable: true,
          },
        },
      };
    }

    await sgMail.send(msg);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Sends an email submitted through the contact form
 * @param {Object} messageDetails - An object containing {fullname, email, message}
 */
async function sendContactUsMessage({ fullname, email, message }) {
  try {
    const msg = {
      to: process.env.CONTACT_EMAIL,
      from: email,
      subject: `Message from ${fullname} via Help find me`,
      text: message,
    };

    await sgMail.send(msg);
  } catch (error) {
    logger.log('error', `Failed to send contact message from ${email}`);
    return handleError(error);
  }
}

module.exports = {
  sendConfirmationEmail,
  sendNewsletterAcknowledgementEmail,
  sendNewsletter,
  sendForgotPasswordMail,
  sendContactUsMessage,
};
