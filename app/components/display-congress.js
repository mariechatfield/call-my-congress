import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['display-congress'],
  message: Ember.inject.service(),
  lookupData: Ember.inject.service(),

  congress: null,

  // We can assume only one district per congress response from the server
  district: Ember.computed.alias('congress.district.districts.firstObject'),

  hasRepresentativesOrSenators: Ember.computed.or(
    'congress.representatives.length',
    'congress.senators.length'
  ),

  successfulLoad: Ember.computed.and(
    'district.id',
    'hasRepresentativesOrSenators'
  ),

  permalink: Ember.computed('district.id', function() {
    return `https://www.callmycongress.com/${this.get('district.id')}`;
  }),

  actions: {
    returnHome() {
      this.get('message').clear();
      this.get('lookupData').clear();
      this.get('router').transitionTo('index');
    }
  }
});
