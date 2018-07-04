import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, find, click } from '@ember/test-helpers';
import {
  COMPLETE_CONGRESS,
  NO_DISTRICT,
  NO_REPRESENTATIVES_OR_SENATORS,
  NO_SENATORS
} from '../../fixtures/congress';
import hbs from 'htmlbars-inline-precompile';
import setupStubs from '../../helpers/setup-stubs';
import a11yAudit from 'ember-a11y-testing/test-support/audit';

module('Integration | Component | display congress', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.stubs = setupStubs([
      {
        name: 'router',
        methods: ['transitionTo']
      }
    ]);
  });

  test('it renders', async function(assert) {
    this.set('congress', COMPLETE_CONGRESS);
    await render(hbs`{{display-congress congress=congress}}`);
    await a11yAudit();

    assert.ok(find('[data-test-display-congress__state]').textContent.match('CA'), 'renders the state');
    assert.ok(find('[data-test-display-congress__district]').textContent.match('12'), 'renders the district number');
    assert.ok(find('[data-test-display-congress__permalink]').textContent.match('CA-12'), 'renders the permalink');

    assert.equal(findAll('[data-test-display-congressperson]').length, 3, 'renders three congress people');
    assert.equal(findAll('[data-test-display-congressperson="representative"]').length, 1, 'renders one representative');
    assert.equal(findAll('[data-test-display-congressperson="senator"]').length, 2, 'renders two senators');

    assert.equal(findAll('[data-test-display-congress__back]').length, 1, 'renders back button');
  });

  test('back button', async function(assert) {
    this.set('congress', COMPLETE_CONGRESS);
    this.set('router', this.stubs.objects.router);
    await render(hbs`{{display-congress congress=congress router=router}}`);
    await a11yAudit();

    assert.equal(this.stubs.calls.router.transitionTo.length, 0, 'router.transitionTo has not been called yet');

    await click('[data-test-display-congress__back]');
    await a11yAudit();

    assert.equal(this.stubs.calls.router.transitionTo.length, 1, 'router.transitionTo was called once');
    assert.deepEqual(this.stubs.calls.router.transitionTo[0], ['search'], 'router.transitionTo was called with "search"');
  });

  test('with partial data, it renders', async function(assert) {
    this.set('congress', NO_SENATORS);
    await render(hbs`{{display-congress congress=congress}}`);

    assert.ok(find('[data-test-display-congress__state]').textContent.match('CA'), 'renders the state');
    assert.ok(find('[data-test-display-congress__district]').textContent.match('12'), 'renders the district number');
    assert.ok(find('[data-test-display-congress__permalink]').textContent.match('CA-12'), 'renders the permalink');

    assert.equal(findAll('[data-test-display-congressperson]').length, 1, 'renders the representative');

    assert.equal(findAll('[data-test-display-congress__back]').length, 1, 'renders back button');
  });

  function testIncompleteFixture(fixture) {
    test('it handles incomplete data', async function(assert) {
      this.set('congress', fixture);
      await this.render(hbs`{{display-congress congress=congress}}`);

      assert.equal(findAll('[data-test-display-congress__state]').length, 0, 'does not render district information');
      assert.equal(findAll('[data-test-display-congressperson]').length, 0, 'does not render congress people');
      assert.equal(findAll('[data-test-display-congress__back]').length, 1, 'renders back button');
    });
  }

  testIncompleteFixture(NO_DISTRICT);
  testIncompleteFixture(NO_REPRESENTATIVES_OR_SENATORS);
});
