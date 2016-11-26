import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('app-message', 'Integration | Component | app message', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{app-message}}`);
  assert.ok(this.$('.app-message').is(':empty'), 'renders nothing when no key provided');

  this.render(hbs`{{app-message messageKey='general.phone'}}`);
  assert.equal(this.$('.app-message').text().trim(), 'Phone', 'renders translation when key provided');
});
