import { resolve, reject } from 'rsvp';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { SINGLE_DISTRICT, MULTIPLE_DISTRICTS } from 'call-my-congress/tests/fixtures/districts';
import setupStubs from 'call-my-congress/tests/helpers/setup-stubs';
import apiUtils from 'call-my-congress/utils/api';

const STREET = '1600 Pennsylvania Ave';
const ENCODED_STREET = '1600%20Pennsylvania%20Ave';
const ZIP = '20500';

module('Unit | Route | search/lookup', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.stubs = setupStubs([
      {
        name: 'message',
        methods: ['clear', 'display', 'displayFromServer']
      }, {
        name: 'routeMethods',
        methods: ['replaceWith', 'transitionTo']
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

    this.responseSuccessful = true;
    this.response = SINGLE_DISTRICT;

    this.owner.lookup('route:search/lookup').setProperties({
      replaceWith: this.stubs.objects.routeMethods.replaceWith,
      transitionTo: this.stubs.objects.routeMethods.transitionTo,
      message: this.stubs.objects.message
    });
  });

  hooks.afterEach(function() {
    apiUtils.getJSON = this.orginalGetJSON;
  });

  module('beforeModel', function() {
    test('transitions back to search if no lookupData', async function(assert) {
      const route = this.owner.lookup('route:search/lookup');

      route.set('lookupData', {});

      await route.beforeModel();

      assert.equal(this.stubs.calls.routeMethods.replaceWith.length, 1, 'calls replaceWith');
      assert.deepEqual(this.stubs.calls.routeMethods.replaceWith[0], ['search'], 'transitions to search route');

      route.set('lookupData', {
        zip: ZIP
      });

      await route.beforeModel();
      assert.equal(this.stubs.calls.routeMethods.replaceWith.length, 1, 'does not call replaceWith again when only zip is set');

      route.set('lookupData', {
        street: STREET
      });

      await route.beforeModel();
      assert.equal(this.stubs.calls.routeMethods.replaceWith.length, 1, 'does not call replaceWith again when only street is set');

      route.set('lookupData', {
        street: STREET,
        zip: ZIP
      });

      await route.beforeModel();
      assert.equal(this.stubs.calls.routeMethods.replaceWith.length, 1, 'does not call replaceWith again when street and zip are set');
    });
  });

  module('model', function() {
    test('formats request with street and zip when both provided', async function(assert) {
      const route = this.owner.lookup('route:search/lookup');

      route.set('lookupData', {
        street: STREET,
        zip: ZIP
      });

      await route.model();

      assert.equal(this.stubs.calls.apiUtils.getJSON.length, 1, 'makes a network request');
      assert.deepEqual(
        this.stubs.calls.apiUtils.getJSON[0],
        [`/api/district-from-address?street=${ENCODED_STREET}&zip=${ZIP}`],
        'formats request with street and zip'
      );
    });

    test('formats request with just zip when no street provided', async function(assert) {
      const route = this.owner.lookup('route:search/lookup');

      route.set('lookupData', {
        zip: ZIP
      });

      await route.model();

      assert.equal(this.stubs.calls.apiUtils.getJSON.length, 1, 'makes a network request');
      assert.deepEqual(
        this.stubs.calls.apiUtils.getJSON[0],
        [`/api/district-from-address?zip=${ZIP}`],
        'formats request with just zip'
      );
    });

    test('returns to search route if error', async function(assert) {
      const route = this.owner.lookup('route:search/lookup');

      this.responseSuccessful = false;

      await route.model();

      assert.equal(this.stubs.calls.apiUtils.getJSON.length, 1, 'makes a network request');
      assert.equal(this.stubs.calls.message.displayFromServer.length, 1, 'displays error from server response');
      assert.equal(this.stubs.calls.routeMethods.replaceWith.length, 1, 'calls replaceWith');
      assert.deepEqual(this.stubs.calls.routeMethods.replaceWith[0], ['search'], 'transitions to search route');
    });
  });

  module('afterModel', function() {
    test('transitions to district route if single result', async function(assert) {
      const route = this.owner.lookup('route:search/lookup');

      await route.afterModel(SINGLE_DISTRICT);

      assert.equal(this.stubs.calls.routeMethods.transitionTo.length, 1, 'calls transitionTo');
      assert.deepEqual(this.stubs.calls.routeMethods.transitionTo[0], ['district', 'CA-12'], 'transitions to district with ID from response');
    });

    test('transitions to pick-district route if multiple results', async function(assert) {
      const route = this.owner.lookup('route:search/lookup');

      await route.afterModel(MULTIPLE_DISTRICTS);

      assert.equal(this.stubs.calls.routeMethods.transitionTo.length, 1, 'calls transitionTo');
      assert.deepEqual(this.stubs.calls.routeMethods.transitionTo[0], ['search.pick-district'], 'transitions to pick-district route');
      assert.deepEqual(route.get('lookupData.districtsToPickFrom'), MULTIPLE_DISTRICTS.districts, 'sets response on lookupData service');
    });

    test('transitions to back to search if no results', async function(assert) {
      const route = this.owner.lookup('route:search/lookup');

      await route.afterModel({});

      assert.equal(this.stubs.calls.message.display.length, 1, 'displays error');
      assert.equal(this.stubs.calls.routeMethods.replaceWith.length, 1, 'calls replaceWith');
      assert.deepEqual(this.stubs.calls.routeMethods.replaceWith[0], ['search'], 'transitions to search route');
    });
  });
});
