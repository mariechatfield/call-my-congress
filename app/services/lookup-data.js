import Ember from 'ember';

export default Ember.Service.extend({
  street: null,
  zip: null,
  districtsToPickFrom: null,

  clear() {
    this.setProperties({
      street: null,
      zip: null,
      districtsToPickFrom: null
    });
  }
});
