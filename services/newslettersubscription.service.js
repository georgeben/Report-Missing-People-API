const geolib = require('geolib');
const { NewsletterSubscription } = require('../db/models');
const emailService = require('./email.service');

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
 * Retrieves all daily newsletter subscribers
 */
async function getDailySubscribers() {
  const subscribers = await NewsletterSubscription.find({
    frequency: 'DAILY',
  }).lean();
  return subscribers;
}

/**
 * Retrieves all weekly newsletter subscribers
 */
async function getWeeklySubscribers() {
  const subscribers = await NewsletterSubscription.find({
    frequency: 'WEEKLY',
  }).lean();
  return subscribers;
}

/**
 * Creates a new newsletter subscriber
 * @param {Object} subscriptionData - The data of the new subscriber
 * @returns {Object} - The new subscriber
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
  {
    newEmail, frequency, address,
  },
) {
  let subscriber = await getSubscriber(email);
  if (newEmail && newEmail !== subscriber.email) subscriber.email = newEmail;
  if (frequency) subscriber.frequency = frequency;
  if (address) subscriber.state = address;

  subscriber = await subscriber.save();
  return subscriber;
}

/**
 * Unsubscribes an email from newsletter
 * @param {String} email - The email to unsubscribe from newsletter
 */
async function unsubscribe(email) {
  const result = await NewsletterSubscription.deleteOne({ email });
  return result;
}

/**
 * Sends a list of reported cases to newsletter subscribers
 * @param {Array} subscribers - All the subscribers to send the newsletter
 * @param {Array} reportedCases - Cases to send to the subscribers
 * @param {String} type - Daily or weekly newsletter
 */
async function processNewsletters(subscribers, reportedCases, type) {
  if (reportedCases.length < 1 || subscribers.length < 1) {
    return;
  }
  // TODO: Refactor this method so that it's time complexity reduces from
  // O(n^2) to something lower
  /*
    - Group cases by location => All the cases that have been reported in an area
    - For each grouped case, find all the users that live near that area,
    - Send the cases for a location to all users that stay near that area
  */

  const groupedCases = [];
  const radius = 100000; // 100km radius

  // Group cases within a 100km radius from each other together (cases in an area)
  const i = 0;
  while (i < reportedCases.length) {
    // A group for the cases in an area
    const group = {
      cases: [],
      subscribers: [],
    };
    // Let the first location be the central point of the area
    const centerPoint = {
      latitude:
        reportedCases[i].addressLastSeen.location.coordinates[1],
      longitude:
        reportedCases[i].addressLastSeen.location.coordinates[0],
    };

    group.centerPoint = centerPoint;
    let j = 1;
    while (j < reportedCases.length) {
      if (
        geolib.isPointWithinRadius(
          {
            latitude:
              reportedCases[j].addressLastSeen.location
                .coordinates[1],
            longitude:
              reportedCases[j].addressLastSeen.location
                .coordinates[0],
          },
          centerPoint,
          radius,
        )
      ) {
        group.cases.push(reportedCases[j]);
        reportedCases.splice(j, 1);
      } else {
        j += 1;
      }
    }
    group.cases.push(reportedCases[i]);
    groupedCases.push(group);
    reportedCases.shift();
  }

  /* Get all the subscribers that stay within 100km radius of the reported cases area
  */
  for (let k = 0; k < subscribers.length; k += 1) {
    const caseGroupNearSubscriberIndex = groupedCases.findIndex((caseGroup) => geolib.isPointWithinRadius(
      {
        latitude: subscribers[k].address.location.coordinates[1],
        longitude: subscribers[k].address.location.coordinates[0],
      },
      caseGroup.centerPoint,
      radius,
    ));

    if (caseGroupNearSubscriberIndex !== -1) {
      // If a subscriber lives within 100km, add subscriber to the email list
      groupedCases[caseGroupNearSubscriberIndex].subscribers.push(
        subscribers[k].email,
      );
    }
  }

  // Send newsletters of cases that have more than one subscriber
  groupedCases.forEach((group) => {
    if (group.subscribers.length >= 1) {
      emailService.sendNewsletter(group.subscribers, group.cases, type);
    }
  });
}

module.exports = {
  getSubscriber,
  addNewSubscription,
  updateSubscription,
  getAllSubscribers,
  unsubscribe,
  getDailySubscribers,
  getWeeklySubscribers,
  processNewsletters,
};
