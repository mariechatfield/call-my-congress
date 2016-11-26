import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['display-congress'],
  message: Ember.inject.service(),

  congress: null,

  successfulLoad: Ember.computed.and(
    'congress.district.id',
    'congress.representatives.length',
    'congress.senators.length'
  ),

  permalink: Ember.computed('congress.district.id', function() {
    return `http://www.callmycongress.com/${this.get('congress.district.id')}`;
  }),

  actions: {
    returnHome() {
      this.get('message').clear();
      this.get('router').transitionTo('index');
    }
  }
});
