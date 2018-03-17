import { resolve, reject } from 'rsvp';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import {
  SINGLE_DISTRICT,
  MULTIPLE_DISTRICTS
} from '../../fixtures/districts';
import $ from 'jquery';
import setupStubs from '../../helpers/setup-stubs';

const STREET = '1600 Pennsylvania Ave';
const ENCODED_STREET = '1600%20Pennsylvania%20Ave';
const ZIP = '20500';

module('Unit | Component | lookup congress', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.stubs = setupStubs([
      {
        name: 'router',
        methods: ['transitionTo']
      }, {
        name: 'message',
        methods: ['clear', 'display', 'displayFromServer']
      }, {
        name: 'lookupData'
      }, {
        name: 'event',
        methods: ['preventDefault']
      }, {
        name: '$',
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

    this.component = this.owner.factoryFor('component:lookup-congress').create();
    this.component.setProperties({
      message: this.stubs.objects.message,
      lookupData: this.stubs.objects.lookupData,
      router: this.stubs.objects.router,
    });

    this.orginalGetJSON = $.getJSON;
    $.getJSON = this.stubs.objects.$.getJSON;
  });

  hooks.afterEach(function() {
    $.getJSON = this.orginalGetJSON;
  });

  test('submit > makes request when street and zip are provided', function(assert) {
    this.component.set('lookupData', {
      street: STREET,
      zip: ZIP
    });
    this.component.submit(this.stubs.objects.event);

    assert.equal(this.stubs.calls.message.clear.length, 1, 'clears any existing messages');
    assert.equal(this.stubs.calls.$.getJSON.length, 1, 'makes a network request');
    assert.deepEqual(
      this.stubs.calls.$.getJSON[0],
      [`/api/district-from-address?street=${ENCODED_STREET}&zip=${ZIP}`],
      'formats request correct'
    );
  });

  test('submit > does not make request unless zip is provided', function(assert) {
    this.component.submit(this.stubs.objects.event);

    assert.equal(this.stubs.calls.message.clear.length, 1, 'clears any existing messages');
    assert.equal(this.stubs.calls.message.display.length, 1, 'displays an error message');
    assert.equal(this.stubs.calls.router.transitionTo.length, 0, 'does not attempt to transition');

    this.component.set('lookupData.street', '1600 Pennsylvania Ave');
    this.component.submit(this.stubs.objects.event);

    assert.equal(this.stubs.calls.message.clear.length, 2, 'clears any existing messages');
    assert.equal(this.stubs.calls.message.display.length, 2, 'displays an error message');
    assert.equal(this.stubs.calls.router.transitionTo.length, 0, 'does not attempt to transition');
  });

  test('lookupDistrict > transitions when response is successful', function(assert) {
    this.responseSuccessful = true;
    this.response = SINGLE_DISTRICT;

    this.component.setProperties('lookupData', {
      street: STREET,
      zip: ZIP
    });

    const done = assert.async();

    this.component.lookupDistrict().then(() => {
      assert.equal(this.stubs.calls.router.transitionTo.length, 1, 'calls router.transitionTo');
      assert.deepEqual(this.stubs.calls.router.transitionTo[0], ['district', 'CA-12'], 'transitions to route based on id of response');
      done();
    });
  });

  test('lookupDistrict > transitions when response is successful with only zip', function(assert) {
    this.responseSuccessful = true;
    this.response = SINGLE_DISTRICT;

    this.component.setProperties('lookupData', {
      zip: ZIP
    });

    const done = assert.async();

    this.component.lookupDistrict().then(() => {
      assert.equal(this.stubs.calls.router.transitionTo.length, 1, 'calls router.transitionTo');
      assert.deepEqual(this.stubs.calls.router.transitionTo[0], ['district', 'CA-12'], 'transitions to route based on id of response');
      done();
    });
  });

  test('lookupDistrict > sets districtsToPickFrom when multiple districts per zip', function(assert) {
    this.responseSuccessful = true;
    this.response = MULTIPLE_DISTRICTS;

    this.component.setProperties('lookupData', {
      zip: ZIP
    });

    const done = assert.async();

    this.component.lookupDistrict().then(() => {
      assert.deepEqual(this.component.get('lookupData.districtsToPickFrom'), MULTIPLE_DISTRICTS.districts);
      assert.equal(this.stubs.calls.router.transitionTo.length, 0, 'does not call calls router.transitionTo');
      done();
    });
  });

  test('lookupDistrict > shows error when response is malformed', function(assert) {
    this.responseSuccessful = true;
    this.response = 'this is an invalid response';

    this.component.setProperties('lookupData', {
      street: STREET,
      zip: ZIP
    });

    const done = assert.async();

    this.component.lookupDistrict().then(() => {
      assert.equal(this.stubs.calls.router.transitionTo.length, 0, 'does not call router');
      assert.equal(this.stubs.calls.message.display.length, 1, 'displays an error');
      done();
    });
  });

  test('lookupDistrict > shows error when response fails', function(assert) {
    this.responseSuccessful = false;
    this.response = 'some error';

    this.component.setProperties('lookupData', {
      street: STREET,
      zip: ZIP
    });

    const done = assert.async();

    this.component.lookupDistrict().then(() => {
      assert.equal(this.stubs.calls.router.transitionTo.length, 0, 'does not call router');
      assert.equal(this.stubs.calls.message.displayFromServer.length, 1, 'displays an error');
      done();
    });
  });
});
