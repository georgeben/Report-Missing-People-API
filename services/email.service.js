const sgMail = require('@sendgrid/mail');
const { authHelper } = require('../utils');
const constants = require('../constants');
require('dotenv').config();

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
                <p style="color: rgb(93, 93, 93); font-size: 17px; margin-top: 50px;">Once confirmed, you'll be able to log in to Barefoot Nomad with your new account.</p>
                <p style="text-align: left; margin-left: 16px; margin-top: 20px; color: rgb(93, 93, 93);">Best wishes from barefoot nomad team</p>
              </div>
              </body>`;
    case 'newsletter-acknowledgement':
      return `<body>
                <h2>You will start receiving emails now</h2>
                <p><a href='${BASE_URL}/api/v1/newsletter/?token=${token}'>Change email subscription settings</a></p>
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

    sgMail.send(msg);
  } catch (error) {
    console.log(error);

    // TODO: Handle error
  }
}

/**
 * Sends an acknowledgement email to users that have subscribed to newsletter
 * @param {String} email - The email to send the mail to
 */
async function sendNewsletterAcknowledgementEmail(email) {
  try {
    const token = await authHelper.signJWTToken({ email });
    console.log('Newsletter token', token);
    const msg = {
      to: email,
      from: constants.FROM_EMAIL,
      subject: 'Thank you for subscribing to our newsletter',
      html: getEmailHtml(
        constants.EMAIL_TYPES.NEWSLETTER_ACKNOWLEDGEMENT,
        token,
      ),
    };

    sgMail.send(msg);
  } catch (error) {
    console.log(error);
    // TODO: Handle error
  }
}

/**
 * Sends a daily newsletter listing all the reported cases that have been reported
 * the past day
 * @param {String} email - The email to send the mail to
 * @param {Array} cases - The array of cases that have been reported since the past day
 */
async function sendNewsletter(email, cases, type) {
  try {
    const token = await authHelper.signJWTToken({ email });
    let text = '';
    for (let i = 0; i < cases.length; i++) {
      text += cases[i].fullname;
    }
    let msg = {
      to: email,
      from: constants.FROM_EMAIL,
      subject: `Reported cases of missing people for the past ${type === 'DAILY' ? 'day' : 'week'}`,
      text,
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

    sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  sendConfirmationEmail,
  sendNewsletterAcknowledgementEmail,
  sendNewsletter,
};
