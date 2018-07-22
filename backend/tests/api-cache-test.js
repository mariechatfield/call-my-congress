/* eslint-env node */
/* global describe,it,before,after */

const { transformZipResultToDistricts, HOUSE_BASE_URL, SENATOR_BASE_URL } = require('../app/api-cache');
const proxyquire =  require('proxyquire').noCallThru();
const assert = require('assert');
const sinon = require('sinon');
const request = require('request');
const fixtures = require('./fixtures/api');
const senateFixtures = require('./fixtures/senate');
const houseFixtures = require('./fixtures/house');

const ZIP_URL = 'http://whoismyrepresentative.com/getall_mems.php?output=json&zip=20500';

const VALID_RESPONSE = { statusCode: 200 };
let requests = {};

function stubRequest(url, body, error = false, response = VALID_RESPONSE) {
  requests[url] = [error, response, body];
}

describe('API Cache', function() {
  before(function() {
    sinon.stub(request, 'get').callsFake(function(options, callback) {
      if (requests[options.url]) {
        callback(...requests[options.url]);
      } else {
        throw new Error(`No stubbed response defined for ${options.url}`);
      }
    });
  });

  after(function() {
    request.get.restore();
  });

  describe('fetchAllRepresentatives', function() {
    before(function() {
      stubRequest(HOUSE_BASE_URL, houseFixtures.RAW_RESPONSE);
    });

    it('passes exact value if cache hits', function(done) {
      const getValueSpy = sinon.stub().returns(houseFixtures.REPRESENTATIVES);
      const storeValueSpy = sinon.spy();
      const apiCache = proxyquire('../app/api-cache', {
        './cache': {
          getValueFromCache: getValueSpy,
          storeValueInCache: storeValueSpy
        }
      });

      apiCache.fetchAllRepresentatives().then(result => {
        assert.deepEqual(result, houseFixtures.REPRESENTATIVES);
        done();
      });
    });

    it('makes request and stores result if cache misses', function(done) {
      const getValueSpy = sinon.stub().returns(null);
      const storeValueSpy = sinon.spy();
      const apiCache = proxyquire('../app/api-cache', {
        './cache': {
          getValueFromCache: getValueSpy,
          storeValueInCache: storeValueSpy
        }
      });

      apiCache.fetchAllRepresentatives().then(result => {
        assert.deepEqual(result, houseFixtures.REPRESENTATIVES);
        assert.ok(storeValueSpy.calledOnce);
        assert.deepEqual(storeValueSpy.firstCall.args[1], houseFixtures.REPRESENTATIVES);
        done();
      });
    });
  });

  describe('fetchAllSenators', function() {
    before(function() {
      stubRequest(SENATOR_BASE_URL, senateFixtures.RAW_RESPONSE);
    });

    it('passes exact value if cache hits', function(done) {
      const getValueSpy = sinon.stub().returns(senateFixtures.SENATORS);
      const storeValueSpy = sinon.spy();
      const apiCache = proxyquire('../app/api-cache', {
        './cache': {
          getValueFromCache: getValueSpy,
          storeValueInCache: storeValueSpy
        }
      });

      apiCache.fetchAllSenators().then(result => {
        assert.deepEqual(result, senateFixtures.SENATORS);
        done();
      });
    });

    it('makes request and stores result if cache misses', function(done) {
      const getValueSpy = sinon.stub().returns(null);
      const storeValueSpy = sinon.spy();
      const apiCache = proxyquire('../app/api-cache', {
        './cache': {
          getValueFromCache: getValueSpy,
          storeValueInCache: storeValueSpy
        }
      });

      apiCache.fetchAllSenators().then(result => {
        assert.deepEqual(result, senateFixtures.SENATORS);
        assert.ok(storeValueSpy.calledOnce);
        assert.deepEqual(storeValueSpy.firstCall.args[1], senateFixtures.SENATORS);
        done();
      });
    });
  });

  describe('fetchDistrictsForZip', function() {
    before(function() {
      stubRequest(ZIP_URL, fixtures.ZIP_ONLY_DISTRICT);
    });

    it('passes exact value if cache hits', function(done) {
      const getValueSpy = sinon.stub().returns(fixtures.DISTRICT_RESPONSE);
      const storeValueSpy = sinon.spy();
      const apiCache = proxyquire('../app/api-cache', {
        './cache': {
          getValueFromCache: getValueSpy,
          storeValueInCache: storeValueSpy
        }
      });

      apiCache.fetchDistrictsForZip(20500).then(result => {
        assert.deepEqual(result, fixtures.DISTRICT_RESPONSE);
        done();
      });
    });

    it('makes request and stores result if cache misses', function(done) {
      const getValueSpy = sinon.stub().returns(null);
      const storeValueSpy = sinon.spy();
      const apiCache = proxyquire('../app/api-cache', {
        './cache': {
          getValueFromCache: getValueSpy,
          storeValueInCache: storeValueSpy
        }
      });

      apiCache.fetchDistrictsForZip(20500).then(result => {
        assert.deepEqual(result, fixtures.DISTRICT_RESPONSE.districts);
        assert.ok(storeValueSpy.calledOnce);
        assert.deepEqual(storeValueSpy.firstCall.args[1], fixtures.DISTRICT_RESPONSE.districts);
        done();
      });
    });
  });

  describe('transformZipResultToDistricts', function() {
    it('with successful API calls, returns correctly formatted response', function() {
      assert.deepEqual(
        transformZipResultToDistricts(fixtures.ZIP_ONLY_DISTRICT, fixtures.SINGLE_DISTRICT_ZIP_CODE),
        fixtures.DISTRICT_RESPONSE.districts
      );
    });

    it('returns correctly formatted response for zip that could be in multiple districts', function() {
      assert.deepEqual(
        transformZipResultToDistricts(fixtures.ZIP_ONLY_WITH_TWO_DISTRICTS, fixtures.TWO_DISTRICT_ZIP_CODE),
        fixtures.TWO_DISTRICTS_RESPONSE.districts
      );
    });

    it('returns correctly formatted response for zip in state with a single at-large district', function() {
      assert.deepEqual(
        transformZipResultToDistricts(fixtures.ZIP_ONLY_WITH_AT_LARGE_DISTRICT),
        fixtures.AT_LARGE_DISTRICT_RESPONSE.districts
      );
    });

    it('with failed API calls, returns null', function() {
      assert.deepEqual(
        transformZipResultToDistricts(`<result message='No Data Found' />`),
        null
      );
    });

    it('with failed API calls, matching a non-voting district, returns correctly formatted response', function() {
      assert.deepEqual(
        transformZipResultToDistricts(`<result message='No Data Found' />`, fixtures.NON_VOTING_ZIP_CODE),
        fixtures.NON_VOTING_DISTRICT_RESPONSE.districts
      );
    });
  });
});