import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | app message', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{app-message}}`);
    assert.ok(this.$('.app-message').is(':empty'), 'renders nothing when no key provided');

    await render(hbs`{{app-message messageKey='general.phone'}}`);
    assert.equal(this.$('.app-message').text().trim(), 'Phone', 'renders translation when key provided');
  });
});
