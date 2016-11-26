import { moduleForComponent, test } from 'ember-qunit';
import {
  COMPLETE_PROFILE,
  NAME_ONLY,
  NO_CONTACT_INFORMATION
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
  assert.ok(this.$('.display-congressperson__twitter').text().match('@NancyPelosi'), 'displays correctly formatted Twitter handle');
  assert.ok(this.$('.display-congressperson__party').text().match('Democrat'), 'displays party affiliation');
  assert.equal(this.$('.display-congressperson__voting-record__link').attr('href'), 'https://www.govtrack.us/congress/members/nancy_pelosi/400314', 'links to voting record');
});

test('it handles incomplete data', function(assert) {
  this.set('congressperson', NAME_ONLY);
  this.render(hbs`{{display-congressperson congressperson=congressperson}}`);

  assert.equal(this.$('.display-congressperson__name').length, 1, 'name always exists');
  assert.equal(this.$('.display-congressperson__phone').length, 0, 'does not render attributes that do not exist');
  assert.equal(this.$('.display-congressperson__twitter').length, 0, 'does not render attributes that do not exist');
  assert.equal(this.$('.display-congressperson__party').length, 0, 'does not render attributes that do not exist');
  assert.equal(this.$('.display-congressperson__voting-record').length, 0, 'does not render attributes that do not exist');

  this.set('congressperson', NO_CONTACT_INFORMATION);
  this.render(hbs`{{display-congressperson congressperson=congressperson}}`);

  assert.equal(this.$('.display-congressperson__name').length, 1, 'name always exists');
  assert.equal(this.$('.display-congressperson__phone').length, 0, 'does not render attributes that do not exist');
  assert.equal(this.$('.display-congressperson__twitter').length, 0, 'does not render attributes that do not exist');
  assert.equal(this.$('.display-congressperson__party').length, 1, 'renders attributes that do exist');
  assert.equal(this.$('.display-congressperson__voting-record').length, 1, 'renders attributes that do exist');
});