import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, find } from '@ember/test-helpers';
import {
  COMPLETE_PROFILE,
  NAME_ONLY,
  VACANT_SEAT
} from '../../fixtures/congressperson';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | display congressperson', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('congressperson', COMPLETE_PROFILE);
    await render(hbs`{{display-congressperson congressperson=congressperson}}`);

    assert.ok(find('[data-test-display-congressperson__name]').textContent.match('Rep. Nancy Pelosi'), 'displays correctly formatted full name');
    assert.ok(find('[data-test-display-congressperson__phone]').textContent.match('202-225-4965'), 'displays phone number');
    assert.ok(find('[data-test-display-congressperson__party]').textContent.match('Democrat'), 'displays party affiliation');
    assert.ok(find('[data-test-display-congressperson__next-election]').textContent.match('2018'), 'displays next election year');
    assert.ok(find('[data-test-display-congressperson__govtrack]').textContent.match('GovTrack.us Record'), 'displays voting record link');
    assert.ok(find('[data-test-display-congressperson__cspan]').textContent.match('Video Appearances in Congress'), 'displays C-SPAN link');

  });

  test('it handles incomplete data', async function(assert) {
    this.set('congressperson', NAME_ONLY);
    await render(hbs`{{display-congressperson congressperson=congressperson}}`);

    assert.equal(findAll('[data-test-display-congressperson__name]').length, 1, 'name always exists');
    assert.equal(findAll('[data-test-display-congressperson__phone]').length, 0, 'does not render attributes that do not exist');
    assert.equal(findAll('[data-test-display-congressperson__party]').length, 0, 'does not render attributes that do not exist');
  });

  test('it handles vacant seat', async function(assert) {
    this.set('congressperson', VACANT_SEAT);
    await render(hbs`{{display-congressperson congressperson=congressperson}}`);

    assert.ok(find('[data-test-display-congressperson__name]').textContent.match('Vacant Seat'), 'displays vacant seat title');
    assert.ok(find('[data-test-display-congressperson__name]').textContent.match('This seat was vacated by Rep. Ryan K. Zinke'), 'displays vacant seat footnote');
    assert.equal(findAll('[data-test-display-congressperson__phone]').length, 0, 'does not render attributes even if they exist');
  });
});