import Ember from 'ember';
import Config from 'call-my-congress/config/environment';

export default Ember.Component.extend({
  congress: null,

  permalink: Ember.computed('congress.district.id', function() {
    return `${Config.rootURL}${this.get('congress.district.id')}`;
  }),

  actions: {
    returnHome() {
      this.get('router').transitionTo('index');
    }
  }
});
