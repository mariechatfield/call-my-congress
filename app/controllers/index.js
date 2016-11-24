import Ember from 'ember';
import $ from 'jquery';

export default Ember.Controller.extend({
  street: null,
  zip: null,

  actions: {
    lookupGeography() {
      const street = encodeURI(this.get('street'));
      const zip = this.get('zip');
      $.ajax(`/lookup/district-from-address?street=${street}&zip=${zip}`)
        .then(result => {
          const district = JSON.parse(result);
          this.transitionToRoute('district', district.id);
        });
    }
  }
});
