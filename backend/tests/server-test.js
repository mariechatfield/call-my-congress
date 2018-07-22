/* eslint-env node */
/* global Promise,describe,before,beforeEach,after,afterEach,it */

const request = require('request');
const supertest = require('supertest');
const proxyquire =  require('proxyquire').noCallThru();
const sinon = require('sinon');
const fixtures = require('./fixtures/api');
const senateFixtures = require('./fixtures/senate');
const houseFixtures = require('./fixtures/house');

const VALID_RESPONSE = { statusCode: 200 };

let requests = {};
let apiCacheStubs = {
  fetchAllRepresentatives() { return Promise.resolve(); },
  fetchAllSenators() { return Promise.resolve(); },
  fetchDistrictsForZip() { return Promise.resolve(); }
};

function stubRequest(url, body, error = false, response = VALID_RESPONSE) {
  requests[url] = [error, response, body];
}

describe('server', function() {
  before(function() {
    sinon.stub(request, 'get').callsFake(function(options, callback) {
      if (requests[options.url]) {
        callback(...requests[options.url]);
      } else {
        throw new Error(`No stubbed response defined for ${options.url}`);
      }
    });
  });

  beforeEach(function() {
    requests = {};
    process.env.PORT = 3001;
    this.server = proxyquire('../app/server', {
      './api-cache': {
        fetchAllRepresentatives() {
          return apiCacheStubs.fetchAllRepresentatives();
        },
        fetchAllSenators() {
          return apiCacheStubs.fetchAllSenators();
        },
        fetchDistrictsForZip() {
          return apiCacheStubs.fetchDistrictsForZip();
        }
      }
    });
  });

  afterEach(function() {
    this.server.close();
  });

  after(function() {
    request.get.restore();
  });

  describe('/api/district-from-address', function() {
    describe('with valid params', function() {
      const apiURL = 'https://geocoding.geo.census.gov/geocoder/geographies/address?benchmark=Public_AR_Current&vintage=Current_Current&format=json&layers=54&street=1600%20Pennsylvania%20Ave&zip=20500';
      const serverURL = '/api/district-from-address?street=1600%20Pennsylvania%20Ave&zip=20500';

      it('with successful API calls, returns correctly formatted response', function(done) {
        stubRequest(apiURL, fixtures.DISTRICT);

        supertest(this.server)
          .get(serverURL)
          .expect(200, fixtures.DISTRICT_RESPONSE, done);
      });

      it('returns correctly formatted response for address that in state with a single at-large district', function(done) {
        stubRequest(apiURL, fixtures.AT_LARGE_DISTRICT);

        supertest(this.server)
          .get(serverURL)
          .expect(200, fixtures.AT_LARGE_DISTRICT_RESPONSE, done);
      });

      it('returns correctly formatted response for address that in non-voting district', function(done) {
        stubRequest(apiURL, fixtures.NON_VOTING_DISTRICT);

        supertest(this.server)
          .get(serverURL)
          .expect(200, fixtures.NON_VOTING_DISTRICT_RESPONSE, done);
      });

      it('with failed API calls, returns correctly formatted error response', function(done) {
        stubRequest(apiURL, { message: 'failed with some error' }, true);

        supertest(this.server)
          .get(serverURL)
          .expect(500, { translationKey: 'UNKNOWN' }, done);
      });

      it('with invalid API calls, returns correctly formatted error response', function(done) {
        stubRequest(apiURL, 'unexpected successful response type');

        supertest(this.server)
          .get(serverURL)
          .expect(500, { translationKey: 'UNKNOWN' }, done);
      });

      describe('providing only zip code', function() {
        const serverURL = '/api/district-from-address?zip=20500';

        it('with valid zip, returns correctly formatted response', function(done) {
          apiCacheStubs.fetchDistrictsForZip = () => new Promise(resolve => resolve(fixtures.DISTRICT_RESPONSE.districts));

          supertest(this.server)
            .get(serverURL)
            .expect(200, fixtures.DISTRICT_RESPONSE, done);
        });

        it('with invalid zip, returns error response', function(done) {
          apiCacheStubs.fetchDistrictsForZip = () => new Promise(resolve => resolve(null));

          stubRequest(apiURL, fixtures.ZIP_ONLY_DISTRICT);

          supertest(this.server)
            .get(serverURL)
            .expect(500, { translationKey: 'INVALID_ADDRESS' }, done);
        });

        it('with error in fetching districts, returns generic error response', function(done) {
          apiCacheStubs.fetchDistrictsForZip = () => new Promise((_, reject) => reject('some error'));

          stubRequest(apiURL, fixtures.ZIP_ONLY_DISTRICT);

          supertest(this.server)
            .get(serverURL)
            .expect(500, { translationKey: 'UNKNOWN' }, done);
        });
      });
    });

    describe('with invalid params', function() {
      it('with missing zip, returns correctly formatted error response', function(done) {
        supertest(this.server)
          .get('/api/district-from-address?street=1600%20%Pennsylvania%20Ave')
          .expect(400, { translationKey: 'MISSING_ZIP' }, done);
      });

      it('with no query params, returns correctly formatted error response', function(done) {
        supertest(this.server)
          .get('/api/district-from-address')
          .expect(400, { translationKey: 'MISSING_ZIP' }, done);
      });
    });
  });

  describe('/api/congress-from-district', function() {
    const serverURL = '/api/congress-from-district?id=CA-12';

    describe('with valid params', function() {
      it('with successful API calls, returns correctly formatted response', function(done) {
        apiCacheStubs.fetchAllSenators = () => new Promise(resolve => resolve(senateFixtures.SENATORS));
        apiCacheStubs.fetchAllRepresentatives = () => new Promise(resolve => resolve(houseFixtures.REPRESENTATIVES));

        supertest(this.server)
          .get(serverURL)
          .expect(200, fixtures.CONGRESS_RESPONSE, done);
      });

      it('handles district id without dash', function(done) {
        apiCacheStubs.fetchAllSenators = () => new Promise(resolve => resolve(senateFixtures.SENATORS));
        apiCacheStubs.fetchAllRepresentatives = () => new Promise(resolve => resolve(houseFixtures.REPRESENTATIVES));

        supertest(this.server)
          .get('/api/congress-from-district?id=CA02')
          .expect(200, fixtures.SINGLE_DIGIT_DISTRICT_CONGRESS_RESPONSE, done);
      });

      it('handles district id with leading zero', function(done) {
        apiCacheStubs.fetchAllSenators = () => new Promise(resolve => resolve(senateFixtures.SENATORS));
        apiCacheStubs.fetchAllRepresentatives = () => new Promise(resolve => resolve(houseFixtures.REPRESENTATIVES));

        supertest(this.server)
          .get('/api/congress-from-district?id=CA-02')
          .expect(200, fixtures.SINGLE_DIGIT_DISTRICT_CONGRESS_RESPONSE, done);
      });

      it('with a state with an at-large district, returns correctly formatted response', function(done) {
        apiCacheStubs.fetchAllSenators = () => new Promise(resolve => resolve(senateFixtures.SENATORS));
        apiCacheStubs.fetchAllRepresentatives = () => new Promise(resolve => resolve(houseFixtures.REPRESENTATIVES));

        supertest(this.server)
          .get('/api/congress-from-district?id=AK-0')
          .expect(200, fixtures.AT_LARGE_CONGRESS_RESPONSE, done);
      });

      it('with a non-voting state with an at-large district, returns correctly formatted response', function(done) {
        apiCacheStubs.fetchAllSenators = () => new Promise(resolve => resolve(senateFixtures.SENATORS));
        apiCacheStubs.fetchAllRepresentatives = () => new Promise(resolve => resolve(houseFixtures.REPRESENTATIVES));

        supertest(this.server)
          .get('/api/congress-from-district?id=PR-0')
          .expect(200, fixtures.NON_VOTING_AT_LARGE_CONGRESS_RESPONSE, done);
      });

      it('with failed API calls, returns correctly formatted error response', function(done) {
        apiCacheStubs.fetchAllSenators = () => new Promise((_, reject) => reject('some error'));
        apiCacheStubs.fetchAllRepresentatives = () => new Promise((_, reject) => reject('some error'));

        supertest(this.server)
          .get(serverURL)
          .expect(500, { translationKey: 'UNKNOWN' }, done);
      });
    });

    describe('with invalid params', function() {
      it('with random string for id, returns correctly formatted error response', function(done) {
        supertest(this.server)
          .get('/api/congress-from-district?id=not-a-valid-id')
          .expect(400, { translationKey: 'INVALID_DISTRICT_ID' }, done);
      });

      it('with invalid state, returns correctly formatted error response', function(done) {
        supertest(this.server)
          .get('/api/congress-from-district?id=LOL-12')
          .expect(400, { translationKey: 'INVALID_DISTRICT_ID' }, done);
      });

      it('with no query params, returns correctly formatted error response', function(done) {
        supertest(this.server)
          .get('/api/congress-from-district')
          .expect(400, { translationKey: 'MISSING_DISTRICT_ID' }, done);
      });
    });
  });
});