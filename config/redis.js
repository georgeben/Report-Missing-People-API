/**
 * Creates and configures a redis client
 */

const redis = require('redis');
const bluebird = require('bluebird');
const url = require('url');
const { logger } = require('../utils');
// const { redisUrl } = require('../config');
require('dotenv').config();

bluebird.promisifyAll(redis.RedisClient.prototype);
let client;
if (process.env.REDIS_URL) {
  const redisUrl = url.parse(process.env.REDIS_URL);
  console.log('Redis port', redisUrl.port);
  console.log('Redis hostname', redisUrl.hostname);
  client = redisUrl.createClient(redisUrl.port, redisUrl.hostname);
  client.auth(redisUrl.auth.split(':')[1]);
} else {
  client = redis.createClient();
}


client.on('connect', () => logger.log('info', 'Successfully connected to redis'));
client.on('error', (error) => logger.log('error', 'Could not connect to redis', { error }));

module.exports = client;
