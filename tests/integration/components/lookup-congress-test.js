import { moduleForComponent, test } from 'ember-qunit';
import { MULTIPLE_DISTRICTS } from '../../fixtures/districts';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('lookup-congress', 'Integration | Component | lookup congress', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{lookup-congress}}`);

  assert.ok(this.$('.lookup-congress__street').is(':visible'), 'renders street address input');
  assert.ok(this.$('.lookup-congress__zip').is(':visible'), 'renders zip code input');
  assert.ok(this.$('.lookup-congress__search').is(':visible'), 'renders search button');

  assert.equal(this.$('.pick-district').length, 0, 'does not render pick-district');
});

test('renders pick-district component when multiple districts', function(assert) {
  this.set('lookupData', { districtsToPickFrom: MULTIPLE_DISTRICTS.districts });
  this.render(hbs`{{lookup-congress lookupData=lookupData}}`);

  assert.equal(this.$('.pick-district').length, 1, 'renders pick-district');
});
