/* eslint-env node */

const { getLogger } = require('./utils');
const redis = require('redis');
const { promisify } = require('util');

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;

const MILLISECONDS_IN_HOUR = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
const MILLISECONDS_IN_DAY = MILLISECONDS_IN_HOUR * HOURS_IN_DAY;
const MILLISECONDS_IN_WEEK = MILLISECONDS_IN_DAY * DAYS_IN_WEEK;

const log = getLogger();
const REDIS_URL = process.env.REDIS_URL || null;
const client = redis.createClient(REDIS_URL);
const getAsync = promisify(client.get).bind(client);

function getValueFromCache(key) {
  return getAsync(key)
    .then(function(result) {
      if (result) {
        log.info("[cache] HIT:", key);
      } else {
        log.info("[cache] MISS:", key);
      }
      return JSON.parse(result);
    });
}

function storeValueInCache(key, value, expiryMS = MILLISECONDS_IN_DAY) {
  const value_as_string = JSON.stringify(value);
  client.setex(key, expiryMS, value_as_string);
}

client
  .on('connect', function() {
    log.info('Redis client connected');
  })
  .on('error', function (err) {
    log.info('Something went wrong ' + err);
  });

module.exports = {
  MILLISECONDS_IN_HOUR,
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_WEEK,
  getValueFromCache,
  storeValueInCache
};