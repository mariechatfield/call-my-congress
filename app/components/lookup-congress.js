import $ from 'jquery';
import Ember from 'ember';

export default Ember.Component.extend({
  street: null,
  zip: null,

  actions: {
    lookupGeography() {
      const street = encodeURI(this.get('street'));
      const zip = this.get('zip');
      $.ajax(`/lookup/district-from-address?street=${street}&zip=${zip}`)
        .then(result => {
          const district = JSON.parse(result);
          this.get('router').transitionTo('district', district.id);
        });
    }
  }
});
