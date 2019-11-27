const sgMail = require('@sendgrid/mail');
const { authHelper } = require('../utils');
const constants = require('../constants');
require('dotenv').config();

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
                <h4 style="color: rgb(93, 93, 93); font-size: 28px; padding-top: 40px;">Thank you for signing up to help find missing people</h4>
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
                        cursor: pointer;" href='${BASE_URL}/api/v1/auth/verify-email?token=${token}'>confirm email</a>
                <p style="color: rgb(93, 93, 93); font-size: 17px; margin-top: 50px;">Once confirmed, you'll be able to log in to Barefoot Nomad with your new account.</p>
                <p style="text-align: left; margin-left: 16px; margin-top: 20px; color: rgb(93, 93, 93);">Best wishes from barefoot nomad team</p>
              </div>
              </body>`;
    default:
      throw new Error('Email kind not found');
  }
}
async function sendConfirmationEmail(email) {
  try {
    const token = await authHelper.signJWTToken(email);
    const msg = {
      to: email,
      from: 'no-reply@report-missing-people.com',
      subject: 'Confirmation Email',
      html: getEmailHtml(constants.EMAIL_TYPES.CONFIRM_EMAIL, token),
    };

    // Refactor this to use a background thread
    sgMail.send(msg);
  } catch (error) {
    console.log(error);

    // Handle error
  }
}

module.exports = {
  sendConfirmationEmail,
};
