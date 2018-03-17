import { test } from 'qunit';
import $ from 'jquery';
import moduleForAcceptance from 'call-my-congress/tests/helpers/module-for-acceptance';
import setupStubs from '../helpers/setup-stubs';

moduleForAcceptance('Acceptance | return to index', {
  beforeEach() {
    this.stubs = setupStubs([
      {
        name: '$',
        methodOverrides: [{
          name: 'getJSON',
          override: () => {
            return {
              catch() { return {}; }
            };
          }
        }]
      }
    ]);

    this.orginalGetJSON = $.getJSON;
    $.getJSON = this.stubs.objects.$.getJSON;
  },

  afterEach() {
    $.getJSON = this.orginalGetJSON;
  }
});

test('visiting index', function(assert) {
  visit('/');
  click('.header');

  andThen(function() {
    assert.equal(currentURL(), '/', 'clicking header on index does not change URL');
  });
});

test('visiting district', function(assert) {
  visit('/CA-12');
  click('.header');

  andThen(function() {
    assert.equal(currentURL(), '/', 'clicking header on district page transitions to index');
  });
});
