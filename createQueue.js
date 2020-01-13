const Bull = require('bull');
const constants = require('./constants');

const jobQueue = new Bull(constants.JOB_QUEUE, process.env.REDIS_URL);
const twitterQueue = new Bull(constants.TWITTER_QUEUE, process.env.REDIS_URL);
module.exports = {
  jobQueue,
  twitterQueue,
};
