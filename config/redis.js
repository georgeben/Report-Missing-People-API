/**
 * Creates and configures a redis client
 */

const redis = require('redis');
const bluebird = require('bluebird');

const client = redis.createClient();
const { logger } = require('../utils');

bluebird.promisifyAll(redis.RedisClient.prototype);

client.on('connect', () => logger.log('info', 'Successfully connected to redis'));
client.on('error', (error) => logger.log('error', 'Could not connect to redis', { error }));

module.exports = client;
