import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['display-congress'],
  message: Ember.inject.service(),

  congress: null,

  // We can assume only one district per congress response from the server
  district: Ember.computed.alias('congress.district.districts.firstObject'),

  successfulLoad: Ember.computed.and(
    'district.id',
    'congress.representatives.length',
    'congress.senators.length'
  ),

  permalink: Ember.computed('district.id', function() {
    return `http://www.callmycongress.com/${this.get('district.id')}`;
  }),

  actions: {
    returnHome() {
      this.get('message').clear();
      this.get('router').transitionTo('index');
    }
  }
});
