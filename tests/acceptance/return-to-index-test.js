import { click, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import $ from 'jquery';
import setupStubs from '../helpers/setup-stubs';

module('Acceptance | return to index', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
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
  });

  hooks.afterEach(function() {
    $.getJSON = this.orginalGetJSON;
  });

  test('visiting index', async function(assert) {
    await visit('/');
    await click('.header');

    assert.equal(currentURL(), '/', 'clicking header on index does not change URL');
  });

  test('visiting district', async function(assert) {
    await visit('/CA-12');
    await click('.header');

    assert.equal(currentURL(), '/', 'clicking header on district page transitions to index');
  });
});
