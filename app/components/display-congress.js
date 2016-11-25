import Ember from 'ember';

export default Ember.Component.extend({
  congress: null,

  permalink: Ember.computed('congress.district.id', function() {
    return `http://www.callmycongress.com/${this.get('congress.district.id')}`;
  }),

  actions: {
    returnHome() {
      this.get('router').transitionTo('index');
    }
  }
});
