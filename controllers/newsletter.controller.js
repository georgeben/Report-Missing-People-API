const { newsletterService } = require('../services');
const { processNewsletterAcknowledgementEmail } = require('../background-jobs');
/**
 * Route handler for subscribing to newsletter
 * @param {Object} req - The incoming HTTP request
 * @param {Object} res - The HTTP response object
 * @param {Function} next - The next middleware
 */
async function addSubscription(req, res, next) {
  try {
    let { email, frequency, state, country } = req.body;
    let existingSubscriber = await newsletterService.getSubscriber(email);
    if (existingSubscriber) {
      return res.status(409).json({
        error: 'This email has already subscribed',
      });
    }
    let subscriptionData = { email, frequency, state, country };
    let newSubscription = await newsletterService.addNewSubscription(
      subscriptionData,
    );
    // Add the newsletter subscription acknowledgement email job to the queue
    processNewsletterAcknowledgementEmail(email);
    return res.status(201).json({
      data: newSubscription,
    });
  } catch (error) {
    console.log(error);
    // TODO: Handle error
  }
}

/**
 * Route handler for updating newsletter subscription setting
 * @param {Object} req - The incoming HTTP request
 * @param {Object} res - The HTTP response object
 * @param {Function} next - The next middleware
 */
async function updateSubscription(req, res, next) {
  /**
   * How can someone update their newsletter subscription?
   * To subscribe to the newsletter, they don't need to register, they
   * can just provide their email and frequency settings.
   * A user would see the link to update subscription settings in the newsletters
   * sent to their inbox. When they click update subscription settings,
   * how do you know which user is trying to update their settings?
   * To do this, I encode the email a user subscribes with into a JWT, add it
   * to the update subscription link in the email, then that
   * JWT is sent as part of the request to update their subscription settings,
   * I can then decode the JWT, check that the email has subscribed, then update
   * the settings
   */
  try {
    let { email } = req.user;
    console.log('User trying to update subscription settings', email);
    let { newEmail, frequency, state, country } = req.body;
    let existingSubscription = await newsletterService.getSubscriber(email);
    if (!existingSubscription) {
      return res.status(404).json({
        error: 'Email not registered yet',
      });
    }

    let updatedSubscription = await newsletterService.updateSubscription(email, {
      newEmail,
      frequency,
      state,
      country,
    });

    // If newEmail, send acknowledgement email to the new email address
    if (newEmail && newEmail !== email) {
      // Add the newsletter subscription acknowledgement email job to the queue
      processNewsletterAcknowledgementEmail(newEmail);
    }

    return res.status(200).json({
      data: updatedSubscription,
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * Route handler for retrieving all the emails that have subscribed to newsletters
 * @param {Object} req - The incoming HTTP request
 * @param {Object} res - The HTTP response object
 * @param {Function} next - The next middleware
 */
async function getAllSubscribers(req, res, next) {
  try {
    const subscribers = await newsletterService.getAllSubscribers();
    return res.status(200).json({
      data: subscribers,
    });
  } catch (error) {
    console.log(error);
    // TODO: Handle error
  }
}

/**
 * Route handler unsubscribing from newsletters
 * @param {Object} req - The incoming HTTP request
 * @param {Object} res - The HTTP response object
 * @param {Function} next - The next middleware
 */
async function unsubscribeFromNewsletter(req, res, next) {
  try {
    let { email } = req.user;
    let existingSubscription = await newsletterService.getSubscriber(email);
    if (!existingSubscription) {
      return res.status(404).json({
        error: 'Email not registered yet',
      });
    }
    await newsletterService.unsubscribe(email);
    return res.status(200).json({
      data: 'Successfully unsubscribed',
    });
  } catch (error) {
    console.log(error);
    // TODO: Handle error
  }
}

module.exports = {
  addSubscription,
  updateSubscription,
  getAllSubscribers,
  unsubscribeFromNewsletter,
};
