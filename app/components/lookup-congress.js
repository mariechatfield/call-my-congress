import $ from 'jquery';
import Ember from 'ember';

export default Ember.Component.extend({
  message: Ember.inject.service(),

  street: null,
  zip: null,

  lookupDistrict() {
    const street = this.get('street');
    const zip = this.get('zip');

    let url;

    if (street) {
      const encodedStreet = encodeURI(street);
      url = `/api/district-from-address?street=${encodedStreet}&zip=${zip}`;
    } else {
      url = `/api/district-from-address?zip=${zip}`;
    }

    return $.getJSON(url)
      .then(result => {
        if (result.districts && result.districts[0] && result.districts[0].id) {
          this.get('router').transitionTo('district', result.districts[0].id);
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

    if (this.get('zip') === null) {
      this.get('message').display('errors.server.MISSING_ZIP');
      return;
    }

    this.lookupDistrict();
  }
});
