import { moduleForComponent, test } from 'ember-qunit';
import {
  SINGLE_DISTRICT,
  MULTIPLE_DISTRICTS
} from '../../fixtures/districts';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pick-district', 'Integration | Component | pick district', {
  integration: true
});

test('it renders', function(assert) {
  this.set('districts', SINGLE_DISTRICT.districts);
  this.render(hbs`{{pick-district districts=districts}}`);

  assert.equal(this.$('.pick-district__link').length, 1, 'shows a link for every district');

  this.set('districts', MULTIPLE_DISTRICTS.districts);

  const $districtLinks = this.$('.pick-district__link');
  const $firstLink = this.$($districtLinks[0]);
  const $secondLink = this.$($districtLinks[1]);
  assert.equal($districtLinks.length, 2, 'shows a link for every district');
  assert.equal($firstLink.text().trim(), 'TX-7', 'displays name of first district');
  assert.equal($secondLink.text().trim(), 'TX-9', 'displays name of second district');
});
