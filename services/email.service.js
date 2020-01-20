/* eslint-disable consistent-return */
const sgMail = require('@sendgrid/mail');
const { authHelper, handleError, logger } = require('../utils');
const constants = require('../constants');
const { frontEndUrl, baseUrl } = require('../config')();

sgMail.setApiKey(process.env.SENDGRID_APIKEY);

/**
 * Returns the HTML for a given type of message
 * @param {String} type - The kind of email
 * @param {token} token - The token
 * @return { String} - The email HTML
 */
function getEmailHtml(type, token) {
  // <p>
  //   <a href="${BASE_URL}/api/v1/newsletter/?token=${token}">
  //     Change email subscription settings
  //   </a>
  // </p>;
  const bodyStyle = "font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  const containerStyle = 'margin: auto;background-color: white;width: 90%;padding-bottom: 40px;box-shadow: box-shadow: 0px 2px 7px 0px rgba(181, 181, 181, 0.4);';
  const headerStyle = 'background: linear-gradient(97.06deg, rgba(89, 215, 182, 0.9) 28.21%, rgba(102, 195, 204, 0.9) 96.06%);';
  switch (type) {
    case 'confirm-email':
      return ` <body style="${bodyStyle}">
                <div
                  style="${containerStyle}"
                >
                  <div style="${headerStyle}">
                    <h4 style="color: white; font-size: 24px; padding: 25px 0; text-align: center;">
                      Please confirm your email
                    </h4>
                  </div>
                  <div style="text-align: center; color: rgb(93, 93, 93); padding: 0 15px; line-height: 1.8;">
                    <p style=" font-size: 17px;text-align: justify;">
                      Hi! Thank you for signing up. To get started, please confirm your account by clicking the button below, Ignore this
                      message if you didn't request it.
                    </p>
                    <a
                      style="background-color: #308894; 
                                      outline: none;
                                      color: white;
                                      margin-top: 10px;
                                      padding: 10px;
                                      text-decoration: none;
                                      display: inline-block;
                                      font-size: 16px;
                                      cursor: pointer;"
                      href="${frontEndUrl}/verify-email?token=${token}"
                      >Confirm email</a
                    >

                    <p style="margin-top: 15px; text-align: justify;  font-size: 17px;">
                      Regards, <br>
                      The Help Look for Me Team.
                    </p>
                  </div>
                </div>
              </body>`;
    case 'newsletter-acknowledgement':
      return `<body>
                <div
                  style="${containerStyle}"
                >
                  <div style="${headerStyle}">
                    <h4 style="color: white; font-size: 24px; padding: 25px 0; text-align: center;">
                      You will start receiving emails now
                    </h4>
                  </div>
                  <div style="text-align: center; color: rgb(93, 93, 93); padding: 0 15px; line-height: 1.8;">
                    <p style=" font-size: 17px;text-align: justify;">
                      Hi there! Thank you so much for subscribing to our newsletter. You will start receiving alerts of people
                      that get missing around you. You can also tell your friends and family to signup to our newsletter so more 
                      people can get informed when people get missing around their location.
                    </p>

                    <p style="margin-top: 15px; text-align: justify;  font-size: 17px;">
                      Regards, <br>
                      The Help Look for Me Team.
                    </p>
                  </div>
                </div>
              </body>
              `;
    case constants.EMAIL_TYPES.FORGOT_PASSWORD:
      return `
              <body>
                <div
                  style="${containerStyle}"
                >
                  <div style="${headerStyle}">
                    <h4 style="color: white; font-size: 24px; padding: 25px 0; text-align: center;">
                      Reset Password
                    </h4>
                  </div>
                  <div style="text-align: center; color: rgb(93, 93, 93); padding: 0 15px; line-height: 1.8;">
                    <p style=" font-size: 17px;text-align: justify;">
                      Oops! You forgot your password? No worries. Click this link to reset your password. <a href='${frontEndUrl}/auth/reset-password?token=${token}'>Reset password</a>
                    </p>

                    <p style="margin-top: 15px; text-align: justify;  font-size: 17px;">
                      Regards, <br>
                      The Help Look for Me Team.
                    </p>
                  </div>
                </div>
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
      from: constants.FROM_EMAIL,
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
      <a href='${frontEndUrl}/cases/${caseData.slug}'>View case</a>
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
