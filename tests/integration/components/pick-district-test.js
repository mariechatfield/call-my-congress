import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import {
  SINGLE_DISTRICT,
  MULTIPLE_DISTRICTS
} from '../../fixtures/districts';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | pick district', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('districts', SINGLE_DISTRICT.districts);
    await render(hbs`{{pick-district districts=districts}}`);

    assert.equal(this.$('.pick-district__link').length, 1, 'shows a link for every district');

    this.set('districts', MULTIPLE_DISTRICTS.districts);

    const $districtLinks = this.$('.pick-district__link');
    const $firstLink = this.$($districtLinks[0]);
    const $secondLink = this.$($districtLinks[1]);
    assert.equal($districtLinks.length, 2, 'shows a link for every district');
    assert.equal($firstLink.text().trim(), 'TX-7', 'displays name of first district');
    assert.equal($secondLink.text().trim(), 'TX-9', 'displays name of second district');
  });
});
