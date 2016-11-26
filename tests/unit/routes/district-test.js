import { moduleFor, test } from 'ember-qunit';
import $ from 'jquery';
import Ember from 'ember';
import setupStubs from '../../helpers/setup-stubs';

const VALID_PARAMS = {
  district_id: 'some-id'
};

const VALID_RESULT = {
  district: {
    id: 'some-id'
  }
};

moduleFor('route:district', 'Unit | Route | district', {
  needs: ['service:message'],

  beforeEach() {
    this.stubs = setupStubs([
      {
        name: 'message',
        methods: ['displayFromServer']
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

    this.orginalGetJSON = $.getJSON;
    $.getJSON = this.stubs.objects.$.getJSON;

    this.route = this.subject();
    this.route.set('message', this.stubs.objects.message);
  },

  afterEach() {
    $.getJSON = this.orginalGetJSON;
  }
});

test('model | returns successful response', function(assert) {
  this.responseSuccessful = true;
  this.response = VALID_RESULT;

  const done = assert.async();

  this.route.model(VALID_PARAMS).then((result) => {
    assert.deepEqual(result, VALID_RESULT, 'returns valid result directly from promise');
    assert.equal(this.stubs.calls.message.displayFromServer.length, 0, 'does not display an error');
    done();
  });
});

test('model | shows error when response fails', function(assert) {
  this.responseSuccessful = false;
  this.response = 'some error';

  const done = assert.async();

  this.route.model(VALID_PARAMS).then(() => {
    assert.equal(this.stubs.calls.message.displayFromServer.length, 1, 'displays an error');
    done();
  });
});

test('model | shows error when params are malformed', function(assert) {
  this.responseSuccessful = false;
  this.response = 'some error';

  const done = assert.async();

  this.route.model({}).then(() => {
    assert.equal(this.stubs.calls.message.displayFromServer.length, 1, 'displays an error');
    done();
  });
});
