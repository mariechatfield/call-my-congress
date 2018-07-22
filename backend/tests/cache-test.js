/* eslint-env node */
/* global describe,it,beforeEach,afterEach */

const { getValueFromCache, storeValueInCache } = require('../app/cache');
const assert = require('assert');
const sinon = require('sinon');

describe('Cache', function() {
  beforeEach(function() {
    this.clock = sinon.useFakeTimers();
  })

  afterEach(function() {
    this.clock.restore();
  })

  it('handles adding and getting values from cache', function() {
    const cacheKey = 'someCacheKey';

    assert.equal(getValueFromCache(cacheKey), null, 'value starts out as null');

    storeValueInCache(cacheKey, 'hello world', 1000);

    assert.equal(getValueFromCache(cacheKey), 'hello world', 'retrieves value after it is set');

    this.clock.tick(500);

    assert.equal(getValueFromCache(cacheKey), 'hello world', 'retrieves value while still fresh');

    this.clock.tick(501);

    assert.equal(getValueFromCache(cacheKey), null, 'value is cleared after timestamp expires');
  });
});