import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | app message', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{app-message}}`);
    assert.equal(find('.app-message').textContent.trim(), '', 'renders nothing when no key provided');

    await render(hbs`{{app-message messageKey='general.phone'}}`);
    assert.equal(find('.app-message').textContent.trim(), 'Phone', 'renders translation when key provided');
  });
});
