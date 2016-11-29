import Ember from 'ember';

export default Ember.Controller.extend({
  message: Ember.inject.service(),

  actions: {
    linkToIndex() {
      this.transitionToRoute('index');
    }
  }
});
