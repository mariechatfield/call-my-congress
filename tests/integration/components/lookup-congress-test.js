import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import { MULTIPLE_DISTRICTS } from '../../fixtures/districts';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | lookup congress', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{lookup-congress}}`);

    assert.ok(this.$('.lookup-congress__street').is(':visible'), 'renders street address input');
    assert.ok(this.$('.lookup-congress__zip').is(':visible'), 'renders zip code input');
    assert.ok(this.$('.lookup-congress__search').is(':visible'), 'renders search button');

    assert.equal(findAll('.pick-district').length, 0, 'does not render pick-district');
  });

  test('renders pick-district component when multiple districts', async function(assert) {
    this.set('lookupData', { districtsToPickFrom: MULTIPLE_DISTRICTS.districts });
    await render(hbs`{{lookup-congress lookupData=lookupData}}`);

    assert.equal(findAll('.pick-district').length, 1, 'renders pick-district');
  });
});
