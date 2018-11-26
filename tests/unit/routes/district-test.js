import { resolve, reject } from 'rsvp';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import apiUtils from 'call-my-congress/utils/api';
import setupStubs from '../../helpers/setup-stubs';

const VALID_PARAMS = {
  district_id: 'some-id'
};

const VALID_RESULT = {
  district: {
    id: 'some-id'
  }
};

module('Unit | Route | district', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.stubs = setupStubs([
      {
        name: 'message',
        methods: ['displayFromServer']
      }, {
        name: 'apiUtils',
        methodOverrides: [{
          name: 'getJSON',
          override: () => {
            if (this.responseSuccessful) {
              return resolve(this.response);
            } else {
              return reject(this.response);
            }
          }
        }]
      }
    ]);

    this.orginalGetJSON = apiUtils.getJSON;
    apiUtils.getJSON = this.stubs.objects.apiUtils.getJSON;

    this.route = this.owner.lookup('route:district');
    this.route.set('message', this.stubs.objects.message);
  });

  hooks.afterEach(function() {
    apiUtils.getJSON = this.orginalGetJSON;
  });

  test('model > returns successful response', function(assert) {
    this.responseSuccessful = true;
    this.response = VALID_RESULT;

    const done = assert.async();

    this.route.model(VALID_PARAMS).then((result) => {
      assert.deepEqual(result, VALID_RESULT, 'returns valid result directly from promise');
      assert.equal(this.stubs.calls.message.displayFromServer.length, 0, 'does not display an error');
      done();
    });
  });

  test('model > shows error when response fails', function(assert) {
    this.responseSuccessful = false;
    this.response = 'some error';

    const done = assert.async();

    this.route.model(VALID_PARAMS).then(() => {
      assert.equal(this.stubs.calls.message.displayFromServer.length, 1, 'displays an error');
      done();
    });
  });

  test('model > shows error when params are malformed', function(assert) {
    this.responseSuccessful = false;
    this.response = 'some error';

    const done = assert.async();

    this.route.model({}).then(() => {
      assert.equal(this.stubs.calls.message.displayFromServer.length, 1, 'displays an error');
      done();
    });
  });
});
