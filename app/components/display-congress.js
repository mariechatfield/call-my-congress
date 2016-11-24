import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    returnHome() {
      this.get('router').transitionTo('index');
    }
  }
});
