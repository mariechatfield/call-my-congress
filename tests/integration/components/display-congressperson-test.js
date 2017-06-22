import { moduleForComponent, test } from 'ember-qunit';
import {
  COMPLETE_PROFILE,
  NAME_ONLY,
  VACANT_SEAT
} from '../../fixtures/congressperson';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('display-congressperson', 'Integration | Component | display congressperson', {
  integration: true
});

test('it renders', function(assert) {
  this.set('congressperson', COMPLETE_PROFILE);
  this.render(hbs`{{display-congressperson congressperson=congressperson}}`);

  assert.ok(this.$('.display-congressperson__name').text().match('Rep. Nancy Pelosi'), 'displays correctly formatted full name');
  assert.ok(this.$('.display-congressperson__phone').text().match('202-225-4965'), 'displays phone number');
  assert.ok(this.$('.display-congressperson__party').text().match('Democrat'), 'displays party affiliation');
  assert.ok(this.$('.display-congressperson__next-election').text().match('2018'), 'displays next election year');
  assert.ok(this.$('.display-congressperson__govtrack').text().match('GovTrack.us Record'), 'displays voting record link');
  assert.ok(this.$('.display-congressperson__cspan').text().match('Video Appearances in Congress'), 'displays C-SPAN link');

});

test('it handles incomplete data', function(assert) {
  this.set('congressperson', NAME_ONLY);
  this.render(hbs`{{display-congressperson congressperson=congressperson}}`);

  assert.equal(this.$('.display-congressperson__name').length, 1, 'name always exists');
  assert.equal(this.$('.display-congressperson__phone').length, 0, 'does not render attributes that do not exist');
  assert.equal(this.$('.display-congressperson__party').length, 0, 'does not render attributes that do not exist');
});

test('it handles vacant seat', function(assert) {
  this.set('congressperson', VACANT_SEAT);
  this.render(hbs`{{display-congressperson congressperson=congressperson}}`);

  assert.ok(this.$('.display-congressperson__name').text().match('Vacant Seat'), 'displays vacant seat title');
  assert.ok(this.$('.display-congressperson__name').text().match('This seat was vacated by Rep. Ryan K. Zinke'), 'displays vacant seat footnote');
  assert.equal(this.$('.display-congressperson__phone').length, 0, 'does not render attributes even if they exist');
});