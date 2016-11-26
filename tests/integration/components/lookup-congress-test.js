import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('lookup-congress', 'Integration | Component | lookup congress', {
  integration: true
});

test('it renders', function(assert) {

  this.render(hbs`{{lookup-congress}}`);

  assert.ok(this.$('.lookup-congress__street').is(':visible'), 'renders street address input');
  assert.ok(this.$('.lookup-congress__zip').is(':visible'), 'renders zip code input');
  assert.ok(this.$('.lookup-congress__search').is(':visible'), 'renders search button');
});
