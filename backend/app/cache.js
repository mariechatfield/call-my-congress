/* eslint-env node */

const { getLogger } = require('./utils');

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;

const MILLISECONDS_IN_HOUR = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
const MILLISECONDS_IN_DAY = MILLISECONDS_IN_HOUR * HOURS_IN_DAY;
const MILLISECONDS_IN_WEEK = MILLISECONDS_IN_DAY * DAYS_IN_WEEK;

const log = getLogger();
const cache = {};

function getValueFromCache(key) {
  const cachedRecord = cache[key];

  if (cachedRecord && cachedRecord.expiryTimestamp) {
    if (Date.now() <= cachedRecord.expiryTimestamp) {
      log.info(`[cache] hit for ${key}`);
      return cachedRecord.value;
    }

    log.info(`[cache] hit for ${key}, but was expired (${new Date(cachedRecord.expiryTimestamp)})`);
    delete cache[key];
    return null;
  }

  log.info(`[cache] miss for ${key}`);
  return null;
}

function storeValueInCache(key, value, expiryMS = MILLISECONDS_IN_DAY) {
  const expiryTimestamp = Date.now() + expiryMS;
  log.info(`[cache] cached value for ${key}, expiryTimestamp=${new Date(expiryTimestamp)}`);
  cache[key] = {
    expiryTimestamp,
    value
  };
}

module.exports = {
  MILLISECONDS_IN_HOUR,
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_WEEK,
  getValueFromCache,
  storeValueInCache
};