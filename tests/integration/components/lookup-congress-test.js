import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll } from '@ember/test-helpers';
import { MULTIPLE_DISTRICTS } from '../../fixtures/districts';
import hbs from 'htmlbars-inline-precompile';
import a11yAudit from 'ember-a11y-testing/test-support/audit';

module('Integration | Component | lookup congress', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{lookup-congress}}`);
    await a11yAudit();

    assert.ok(find('[data-test-lookup-congress__street]'), 'renders street address input');
    assert.ok(find('[data-test-lookup-congress__zip]'), 'renders zip code input');
    assert.ok(find('[data-test-lookup-congress__search]'), 'renders search button');

    assert.equal(findAll('[data-test-pick-district]').length, 0, 'does not render pick-district');
  });

  test('renders pick-district component when multiple districts', async function(assert) {
    this.set('lookupData', { districtsToPickFrom: MULTIPLE_DISTRICTS.districts });
    await render(hbs`{{lookup-congress lookupData=lookupData}}`);
    await a11yAudit();

    assert.equal(findAll('[data-test-pick-district]').length, 1, 'renders pick-district');
  });
});
