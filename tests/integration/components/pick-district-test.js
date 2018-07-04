import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import {
  SINGLE_DISTRICT,
  MULTIPLE_DISTRICTS
} from '../../fixtures/districts';
import hbs from 'htmlbars-inline-precompile';
import a11yAudit from 'ember-a11y-testing/test-support/audit';

module('Integration | Component | pick district', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('districts', SINGLE_DISTRICT.districts);
    await render(hbs`{{pick-district districts=districts}}`);
    await a11yAudit();

    assert.equal(findAll('[data-test-pick-district__link]').length, 1, 'shows a link for every district');

    this.set('districts', MULTIPLE_DISTRICTS.districts);

    const districtLinks = findAll('[data-test-pick-district__link]');
    const [ firstLink, secondLink ] = districtLinks;
    assert.equal(districtLinks.length, 2, 'shows a link for every district');
    assert.equal(firstLink.textContent.trim(), 'TX-7', 'displays name of first district');
    assert.equal(secondLink.textContent.trim(), 'TX-9', 'displays name of second district');
  });
});
