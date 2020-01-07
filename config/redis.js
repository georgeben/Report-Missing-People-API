/**
 * Creates and configures a redis client
 */

const redis = require('redis');
const bluebird = require('bluebird');
const { logger } = require('../utils');
// const { redisUrl } = require('../config');
require('dotenv').config();

bluebird.promisifyAll(redis.RedisClient.prototype);

const client = redis.createClient(process.env.REDIS_URL);


client.on('connect', () => logger.log('info', 'Successfully connected to redis'));
client.on('error', (error) => logger.log('error', 'Could not connect to redis', { error }));

module.exports = client;
