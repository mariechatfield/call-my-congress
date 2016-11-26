import $ from 'jquery';
import Ember from 'ember';

export default Ember.Component.extend({
  message: Ember.inject.service(),

  street: null,
  zip: null,

  lookupDistrict() {
    const street = encodeURI(this.get('street'));
    const zip = this.get('zip');
    return $.getJSON(`/api/district-from-address?street=${street}&zip=${zip}`)
      .then(district => {
        if (district.id) {
          this.get('router').transitionTo('district', district.id);
        } else {
          this.get('message').display('errors.general');
        }
      })
      .catch(error => {
        this.get('message').displayFromServer(error);
      });
  },

  submit(event) {
    event.preventDefault();
    this.get('message').clear();

    if (this.get('street') === null || this.get('zip') === null) {
      this.get('message').display('errors.server.INCOMPLETE_ADDRESS');
      return;
    }

    this.lookupDistrict();
  }
});
