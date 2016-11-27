const request = require('request');
const supertest = require('supertest');
const sinon = require('sinon');
const fixtures = require('./fixtures/api');

let callNum = 0;
let requestStub;

const VALID_RESPONSE = { statusCode: 200 };

function stubRequest(body, error = false, response = VALID_RESPONSE) {
  requestStub.onCall(callNum++).yields(error, response, body);
}

describe('server', function() {
  before(function() {
    requestStub = sinon.stub(request, 'get');
  });
  beforeEach(function() {
    process.env.PORT = 3001;
    this.server = require('../app/server');
  });

  afterEach(function() {
    this.server.close();
  });

  after(function() {
    request.get.restore();
  });

  describe('/api/district-from-address', function() {
    describe('with valid params', function() {
      it('with successful API calls, returns correctly formatted response', function testSlash(done) {
        stubRequest(fixtures.DISTRICT);

        supertest(this.server)
          .get('/api/district-from-address?street=1600%20Pennsylvania%20Ave&zip=20500')
          .expect(200, fixtures.DISTRICT_RESPONSE, done);
      });

      it('with failed API calls, returns correctly formatted error response', function testSlash(done) {
        stubRequest({ message: 'failed with some error' }, true);

        supertest(this.server)
          .get('/api/district-from-address?street=1600%20Pennsylvania%20Ave&zip=20500')
          .expect(500, { translationKey: 'UNKNOWN' }, done);
      });

      it('with invalid API calls, returns correctly formatted error response', function testSlash(done) {
        stubRequest('unexpected successful response type');

        supertest(this.server)
          .get('/api/district-from-address?street=1600%20Pennsylvania%20Ave&zip=20500')
          .expect(500, { translationKey: 'UNKNOWN' }, done);
      });
    });

    describe('with invalid params', function() {
      it('with missing street, returns correctly formatted error response', function testSlash(done) {
        supertest(this.server)
          .get('/api/district-from-address?zip=20500')
          .expect(400, { translationKey: 'INCOMPLETE_ADDRESS' }, done);
      });

      it('with missing zip, returns correctly formatted error response', function testSlash(done) {
        supertest(this.server)
          .get('/api/district-from-address?street=1600%20%Pennsylvania%20Ave')
          .expect(400, { translationKey: 'INCOMPLETE_ADDRESS' }, done);
      });

      it('with no query params, returns correctly formatted error response', function testSlash(done) {
        supertest(this.server)
          .get('/api/district-from-address')
          .expect(400, { translationKey: 'INCOMPLETE_ADDRESS' }, done);
      });
    });
  });

  describe('/api/congress-from-district', function() {
    describe('with valid params', function() {
      it('with successful API calls, returns correctly formatted response', function testSlash(done) {
        stubRequest(fixtures.REPRESENTATIVE);
        stubRequest(fixtures.SENATORS);

        supertest(this.server)
          .get('/api/congress-from-district?id=CA-12')
          .expect(200, fixtures.CONGRESS_RESPONSE, done);
      });

      it('with failed API calls, returns correctly formatted error response', function testSlash(done) {
        stubRequest({ message: 'failed with some error' }, true);
        stubRequest({ message: 'another error' }, true);

        supertest(this.server)
          .get('/api/congress-from-district?id=CA-12')
          .expect(500, { translationKey: 'UNKNOWN' }, done);
      });

      it('with invalid API calls, returns correctly formatted error response', function testSlash(done) {
        stubRequest('unexpected successful response type');
        stubRequest('unexpected error response type', true);

        supertest(this.server)
          .get('/api/congress-from-district?id=CA-12')
          .expect(500, { translationKey: 'UNKNOWN' }, done);
      });
    });

    describe('with invalid params', function() {
      it('with random string for id, returns correctly formatted error response', function testSlash(done) {
        supertest(this.server)
          .get('/api/congress-from-district?id=not-a-valid-id')
          .expect(400, { translationKey: 'INVALID_DISTRICT_ID' }, done);
      });

      it('with invalid state, returns correctly formatted error response', function testSlash(done) {
        supertest(this.server)
          .get('/api/congress-from-district?id=LOL-12')
          .expect(400, { translationKey: 'INVALID_DISTRICT_ID' }, done);
      });

      it('with no query params, returns correctly formatted error response', function testSlash(done) {
        supertest(this.server)
          .get('/api/congress-from-district')
          .expect(400, { translationKey: 'MISSING_DISTRICT_ID' }, done);
      });
    });
  });
});