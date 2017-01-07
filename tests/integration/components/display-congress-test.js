import { moduleForComponent, test } from 'ember-qunit';
import {
  COMPLETE_CONGRESS,
  NO_DISTRICT,
  NO_REPRESENTATIVES_OR_SENATORS,
  NO_SENATORS
} from '../../fixtures/congress';
import hbs from 'htmlbars-inline-precompile';
import setupStubs from '../../helpers/setup-stubs';

moduleForComponent('display-congress', 'Integration | Component | display congress', {
  integration: true,

  beforeEach() {
    this.stubs = setupStubs([
      {
        name: 'router',
        methods: ['transitionTo']
      }
    ]);
  }
});

test('it renders', function(assert) {
  this.set('congress', COMPLETE_CONGRESS);
  this.render(hbs`{{display-congress congress=congress}}`);

  assert.ok(this.$('.display-congress__state').text().match('CA'), 'renders the state');
  assert.ok(this.$('.display-congress__district').text().match('12'), 'renders the district number');
  assert.ok(this.$('.display-congress__permalink').text().match('CA-12'), 'renders the permalink');

  assert.equal(this.$('.display-congressperson').length, 3, 'renders three congress people');

  assert.equal(this.$('.display-congress__back').length, 1, 'renders back button');
});

test('back button', function(assert) {
  this.set('congress', COMPLETE_CONGRESS);
  this.set('router', this.stubs.objects.router);
  this.render(hbs`{{display-congress congress=congress router=router}}`);

  assert.equal(this.stubs.calls.router.transitionTo.length, 0, 'router.transitionTo has not been called yet');

  this.$('.button-primary:contains(Search Again)').click();

  assert.equal(this.stubs.calls.router.transitionTo.length, 1, 'router.transitionTo was called once');
  assert.deepEqual(this.stubs.calls.router.transitionTo[0], ['index'], 'router.transitionTo was called with "index"');
});

test('with partial data, it renders', function(assert) {
  this.set('congress', NO_SENATORS);
  this.render(hbs`{{display-congress congress=congress}}`);

  assert.ok(this.$('.display-congress__state').text().match('CA'), 'renders the state');
  assert.ok(this.$('.display-congress__district').text().match('12'), 'renders the district number');
  assert.ok(this.$('.display-congress__permalink').text().match('CA-12'), 'renders the permalink');

  assert.equal(this.$('.display-congressperson').length, 1, 'renders the representative');

  assert.equal(this.$('.display-congress__back').length, 1, 'renders back button');
});

function testIncompleteFixture(fixture) {
  test('it handles incomplete data', function(assert) {
    this.set('congress', fixture);
    this.render(hbs`{{display-congress congress=congress}}`);

    assert.equal(this.$('.display-congress__state').length, 0, 'does not render district information');
    assert.equal(this.$('.display-congressperson').length, 0, 'does not render congress people');
    assert.equal(this.$('.display-congress__back').length, 1, 'renders back button');
  });
}

testIncompleteFixture(NO_DISTRICT);
testIncompleteFixture(NO_REPRESENTATIVES_OR_SENATORS);
