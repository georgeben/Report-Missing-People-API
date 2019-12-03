const { NewsletterSubscription } = require('../db/models');

/**
 * Retrieves a newsletter subscriber with the given email
 * @param {String} email - The email of the user
 */
async function getSubscriber(email) {
  const subscribed = await NewsletterSubscription.findOne({ email });
  return subscribed;
}

/**
 * Retrieves all newsletter subscribers
 */
async function getAllSubscribers() {
  const subscribers = await NewsletterSubscription.find({});
  return subscribers;
}

/**
 * Creates a new newsletter subscriber
 * @param {Object} subscriptionData - The data of the new subscriber
 */
async function addNewSubscription(subscriptionData) {
  let subscription = new NewsletterSubscription(subscriptionData);
  subscription = await subscription.save();
  return subscription;
}

/**
 * Updates subscription setting
 * @param {String} email - The email of the subscriber updating subscription settings
 * @param {*} param1 - The new subscription settings
 */
async function updateSubscription(
  email,
  { newEmail, frequency, state, country },
) {
  let subscriber = await getSubscriber(email);
  if (newEmail && newEmail !== subscriber.email) subscriber.email = newEmail;
  if (frequency) subscriber.frequency = frequency;
  if (state) subscriber.state = state;
  if (country) subscriber.country = country;

  subscriber = await subscriber.save();
  return subscriber;
}

async function unsubscribe(email) {
  let result = await NewsletterSubscription.deleteOne({ email });
  return result;
}

module.exports = {
  getSubscriber,
  addNewSubscription,
  updateSubscription,
  getAllSubscribers,
  unsubscribe,
};
