import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import tHelper from 'ember-i18n/helper';

const URL1 = 'http://www.callmycongress.com';
const URL2 = 'http://www.callmycongress.com/CA-12';

moduleForComponent('translate-format-link', 'Integration | Component | translate format link', {
  integration: true,

  beforeEach() {
    this.container.lookup('service:i18n').set('locale', 'test');
    this.registry.register('helper:t', tHelper);

    this.container.lookup('service:i18n').addTranslations('test', {
      'noLinks': 'Hello world.',
      'oneLink': '{{link-hello}}Hello world{{/link-hello}}?',
      'twoLinks': '{{link-hello}}Hello{{/link-hello}} {{link-world}}world{{/link-world}}!'
    });
  }
});

test('it adds links to DOM', function(assert) {
  this.setProperties({
    key: 'oneLink',
    links: { hello:  URL1}
  });
  this.render(hbs`{{translate-format-link key=key links=links}}`);

  assert.equal(this.$().text().trim(), 'Hello world?', 'renders correct translation');
  assert.equal(this.$('.translate-format-link__link').length, 1, 'added one link');
  assert.equal(this.$('.translate-format-link__link').attr('href'), URL1, 'adds correct url to link');

  this.setProperties({
    key: 'twoLinks',
    links: { hello: URL1, world: URL2 }
  });

  assert.equal(this.$().text().trim(), 'Hello world!', 'renders correct translation');
  assert.equal(this.$('.translate-format-link__link').length, 2, 'added one link');
  assert.equal(this.$('.translate-format-link__link:contains(Hello)').attr('href'), URL1, 'adds correct url to link');
  assert.equal(this.$('.translate-format-link__link:contains(world)').attr('href'), URL2, 'adds correct url to link');
});

test('it gracefully handles finding no valid links', function(assert) {
  this.setProperties({
    key: 'noLinks',
    links: {}
  });
  this.render(hbs`{{translate-format-link key=key links=links}}`);

  assert.equal(this.$().text().trim(), 'Hello world.', 'renders correct translation');
  assert.equal(this.$('.translate-format-link__link').length, 0, 'did not add any links');

  this.set('links', [{ 'notARealLink': 'http://www.callmycongress.com' }]);
  assert.equal(this.$().text().trim(), 'Hello world.', 'renders correct translation');
  assert.equal(this.$('.translate-format-link__link').length, 0, 'did not add any links');

  this.set('key', 'oneLink');
  assert.equal(this.$().text().trim(), 'Hello world?', 'renders correct translation');
  assert.equal(this.$('.translate-format-link__link').length, 0, 'did not add any links');
});

test('it gracefully handles extra link definitions', function(assert) {
  this.setProperties({
    key: 'noLinks',
    links: { test: URL1, adding: URL1, a: URL1, bunch: URL2, of: URL2, links: URL2 }
  });
  this.render(hbs`{{translate-format-link key=key links=links}}`);

  assert.equal(this.$().text().trim(), 'Hello world.', 'renders correct translation');
  assert.equal(this.$('.translate-format-link__link').length, 0, 'did not add any links');
});

test('it gracefully handles being given invalid parameters', function(assert) {
  this.render(hbs`{{translate-format-link key=key links=links}}`);

  assert.equal(this.$().text().trim(), 'ERROR: Must provide key parameter to translate-format-link', 'displays error message for missing key param');

  this.set('key', 'fakeKey');
  assert.equal(this.$().text().trim(), 'ERROR: Must provide links parameter to translate-format-link', 'displays error message for missing links param');

  this.set('links', {});
  assert.equal(this.$().text().trim(), 'Missing translation: fakeKey', 'displays generic error message for missing translation');
});
