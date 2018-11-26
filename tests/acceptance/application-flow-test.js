import { resolve, reject } from 'rsvp';
import { module, test } from 'qunit';
import { visit, fillIn, click, triggerEvent } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { MULTIPLE_DISTRICTS } from 'call-my-congress/tests/fixtures/districts';
import { COMPLETE_CONGRESS } from 'call-my-congress/tests/fixtures/congress';
import a11yAudit from 'ember-a11y-testing/test-support/audit';
import setupStubs from 'call-my-congress/tests/helpers/setup-stubs';
import apiUtils from 'call-my-congress/utils/api';

module('Acceptance | application flow', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.stubs = setupStubs([
      {
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
  });

  hooks.afterEach(function() {
    apiUtils.getJSON = this.orginalGetJSON;
  });

  test('picking from multiple districts', async function(assert) {
    await visit('/');
    await a11yAudit();

    assert.equal(document.documentElement.getAttribute('lang'), 'en-us', 'initializer sets lang code on document for screen readers');

    await triggerEvent('[data-test-lookup-congress]', 'submit');
    await a11yAudit();

    let errorMessage = this.element.querySelector('.app-message');
    assert.ok(errorMessage, 'error message is visible');
    assert.equal(errorMessage.textContent.trim(), 'Please provide a valid zip code.');

    this.response = MULTIPLE_DISTRICTS;

    await fillIn('[data-test-lookup-congress__zip-input', '77035');
    await triggerEvent('[data-test-lookup-congress]', 'submit');
    await a11yAudit();

    errorMessage = this.element.querySelector('.app-message');
    assert.notOk(errorMessage, 'no more error message');

    const pickDistricts = this.element.querySelectorAll('[data-test-pick-district__link]');

    assert.equal(pickDistricts.length, 2, 'renders two districts to pick from');
    assert.equal(pickDistricts[0].textContent.trim(), 'TX-7', 'displays first district name');
    assert.equal(pickDistricts[1].textContent.trim(), 'TX-9', 'displays second district name');

    this.response = COMPLETE_CONGRESS;

    await click(pickDistricts[0].querySelector('a'));
    await a11yAudit();

    assert.ok(this.element.querySelector('[data-test-display-congress__state]').textContent.match('CA'), 'renders the state');
    assert.ok(this.element.querySelector('[data-test-display-congress__district]').textContent.match('12'), 'renders the district number');
    assert.ok(this.element.querySelector('[data-test-display-congress__permalink]').textContent.match('CA-12'), 'renders the permalink');

    assert.equal(this.element.querySelectorAll('[data-test-display-congressperson]').length, 3, 'renders three congress people');
    assert.equal(this.element.querySelectorAll('[data-test-display-congressperson="representative"]').length, 1, 'renders one representative');
    assert.equal(this.element.querySelectorAll('[data-test-display-congressperson="senator"]').length, 2, 'renders two senators');
  });
});
