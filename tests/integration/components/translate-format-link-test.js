import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import tHelper from 'ember-i18n/helper';

const URL1 = 'http://www.callmycongress.com';
const URL2 = 'http://www.callmycongress.com/CA-12';

module('Integration | Component | translate format link', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.lookup('service:i18n').set('locale', 'en');
    this.owner.register('helper:t', tHelper);

    this.owner.lookup('service:i18n').addTranslations('en', {
      'noLinks': 'Hello world.',
      'oneLink': '{{link-hello}}Hello world{{/link-hello}}?',
      'twoLinks': '{{link-hello}}Hello{{/link-hello}} {{link-world}}world{{/link-world}}!'
    });
  });

  test('it adds links to DOM', async function(assert) {
    this.setProperties({
      key: 'oneLink',
      links: { hello:  URL1}
    });
    await render(hbs`<span>{{translate-format-link key=key links=links}}</span>`);

    assert.equal(find('span').textContent.trim(), 'Hello world?', 'renders correct translation');
    assert.equal(findAll('.translate-format-link__link').length, 1, 'added one link');
    assert.equal(find('.translate-format-link__link').getAttribute('href'), URL1, 'adds correct url to link');

    this.setProperties({
      key: 'twoLinks',
      links: { hello: URL1, world: URL2 }
    });

    assert.equal(find('span').textContent.trim(), 'Hello world!', 'renders correct translation');
    assert.equal(findAll('.translate-format-link__link').length, 2, 'added one link');
    assert.equal(this.$('.translate-format-link__link:contains(Hello)').attr('href'), URL1, 'adds correct url to link');
    assert.equal(this.$('.translate-format-link__link:contains(world)').attr('href'), URL2, 'adds correct url to link');
  });

  test('it gracefully handles finding no valid links', async function(assert) {
    this.setProperties({
      key: 'noLinks',
      links: {}
    });
    await render(hbs`<span>{{translate-format-link key=key links=links}}</span>`);

    assert.equal(find('span').textContent.trim(), 'Hello world.', 'renders correct translation');
    assert.equal(findAll('.translate-format-link__link').length, 0, 'did not add any links');

    this.set('links', [{ 'notARealLink': 'http://www.callmycongress.com' }]);
    assert.equal(find('span').textContent.trim(), 'Hello world.', 'renders correct translation');
    assert.equal(findAll('.translate-format-link__link').length, 0, 'did not add any links');

    this.set('key', 'oneLink');
    assert.equal(find('span').textContent.trim(), 'Hello world?', 'renders correct translation');
    assert.equal(findAll('.translate-format-link__link').length, 0, 'did not add any links');
  });

  test('it gracefully handles extra link definitions', async function(assert) {
    this.setProperties({
      key: 'noLinks',
      links: { test: URL1, adding: URL1, a: URL1, bunch: URL2, of: URL2, links: URL2 }
    });
    await render(hbs`<span>{{translate-format-link key=key links=links}}</span>`);

    assert.equal(find('span').textContent.trim(), 'Hello world.', 'renders correct translation');
    assert.equal(findAll('.translate-format-link__link').length, 0, 'did not add any links');
  });

  test('it gracefully handles being given invalid parameters', async function(assert) {
    await render(hbs`<span>{{translate-format-link key=key links=links}}</span>`);

    assert.equal(find('span').textContent.trim(), 'ERROR: Must provide key parameter to translate-format-link', 'displays error message for missing key param');

    this.set('key', 'fakeKey');
    assert.equal(find('span').textContent.trim(), 'ERROR: Must provide links parameter to translate-format-link', 'displays error message for missing links param');

    this.set('links', {});
    assert.equal(find('span').textContent.trim(), 'Missing translation: fakeKey', 'displays generic error message for missing translation');
  });
});
