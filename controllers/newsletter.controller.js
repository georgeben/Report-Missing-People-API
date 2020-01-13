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
    const { email, frequency, address } = req.body;
    const existingSubscriber = await newsletterService.getSubscriber(email);
    if (existingSubscriber) {
      return res.status(409).json({
        error: 'This email has already subscribed',
      });
    }
    const subscriptionData = { email, frequency, address };
    const newSubscription = await newsletterService.addNewSubscription(
      subscriptionData,
    );
    // Add the newsletter subscription acknowledgement email job to the queue
    processNewsletterAcknowledgementEmail(email);
    return res.status(201).json({
      data: newSubscription,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Route handler for updating newsletter subscription setting
 * @param {Object} req - The incoming HTTP request
 * @param {Object} res - The HTTP response object
 * @param {Function} next - The next middleware
 */
async function updateSubscription(req, res, next) {
  try {
    const { email } = req.user;
    const {
      newEmail, frequency, address,
    } = req.body;
    const existingSubscription = await newsletterService.getSubscriber(email);
    if (!existingSubscription) {
      return res.status(404).json({
        error: 'Email not registered yet',
      });
    }

    const emailExists = await newsletterService.getSubscriber(newEmail);
    if (emailExists) {
      return res.status(409).json({
        error: 'This email has already subscribed',
      });
    }

    const updatedSubscription = await newsletterService.updateSubscription(email, {
      newEmail,
      frequency,
      address,
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
    return next(error);
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
    return next(error);
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
    const { email } = req.user;
    const existingSubscription = await newsletterService.getSubscriber(email);
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
    return next(error);
  }
}

module.exports = {
  addSubscription,
  updateSubscription,
  getAllSubscribers,
  unsubscribeFromNewsletter,
};
