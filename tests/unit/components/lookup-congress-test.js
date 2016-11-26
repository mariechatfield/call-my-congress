import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import $ from 'jquery';
import setupStubs from '../../helpers/setup-stubs';

const STREET = '1600 Pennsylvania Ave';
const ENCODED_STREET = '1600%20Pennsylvania%20Ave';
const ZIP = '20500';

moduleForComponent('lookup-congress', 'Unit | Component | lookup congress', {
  unit: true,

  beforeEach() {
    this.stubs = setupStubs([
      {
        name: 'router',
        methods: ['transitionTo']
      }, {
        name: 'message',
        methods: ['clear', 'display', 'displayFromServer']
      }, {
        name: 'event',
        methods: ['preventDefault']
      }, {
        name: '$',
        methodOverrides: [{
          name: 'getJSON',
          override: () => {
            if (this.responseSuccessful) {
              return Ember.RSVP.resolve(this.response);
            } else {
              return Ember.RSVP.reject(this.response);
            }
          }
        }]
      }
    ]);

    this.component = this.subject();
    this.component.setProperties({
      message: this.stubs.objects.message,
      router: this.stubs.objects.router
    });

    this.orginalGetJSON = $.getJSON;
    $.getJSON = this.stubs.objects.$.getJSON;
  },

  afterEach() {
    $.getJSON = this.orginalGetJSON;
  }
});

test('submit | makes request when street and zip are provided', function(assert) {
  this.component.setProperties({
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

test('submit | does not make request unless both street and zip are provided', function(assert) {
  this.component.submit(this.stubs.objects.event);

  assert.equal(this.stubs.calls.message.clear.length, 1, 'clears any existing messages');
  assert.equal(this.stubs.calls.message.display.length, 1, 'displays an error message');
  assert.equal(this.stubs.calls.router.transitionTo.length, 0, 'does not attempt to transition');

  this.component.set('street', '1600 Pennsylvania Ave');
  this.component.submit(this.stubs.objects.event);

  assert.equal(this.stubs.calls.message.clear.length, 2, 'clears any existing messages');
  assert.equal(this.stubs.calls.message.display.length, 2, 'displays an error message');
  assert.equal(this.stubs.calls.router.transitionTo.length, 0, 'does not attempt to transition');

  this.component.setProperties({
    street: null,
    zip: ZIP
  });
  this.component.submit(this.stubs.objects.event);

  assert.equal(this.stubs.calls.message.clear.length, 3, 'clears any existing messages');
  assert.equal(this.stubs.calls.message.display.length, 3, 'displays an error message');
  assert.equal(this.stubs.calls.router.transitionTo.length, 0, 'does not attempt to transition');
});

test('lookupDistrict | transitions when response is successful', function(assert) {
  this.responseSuccessful = true;
  this.response = { id: 'some-id' };

  this.component.setProperties({
    street: STREET,
    zip: ZIP
  });

  const done = assert.async();

  this.component.lookupDistrict().then(() => {
    assert.equal(this.stubs.calls.router.transitionTo.length, 1, 'calls router.transitionTo');
    assert.deepEqual(this.stubs.calls.router.transitionTo[0], ['district', 'some-id'], 'transitions to route based on id of response');
    done();
  });
});

test('lookupDistrict | shows error when response is malformed', function(assert) {
  this.responseSuccessful = true;
  this.response = 'this is an invalid response';

  this.component.setProperties({
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

test('lookupDistrict | shows error when response fails', function(assert) {
  this.responseSuccessful = false;
  this.response = 'some error';

  this.component.setProperties({
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
