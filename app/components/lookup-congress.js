import $ from 'jquery';
import Ember from 'ember';

export default Ember.Component.extend({
  street: null,
  zip: null,

  submit(event) {
    event.preventDefault();

    const street = encodeURI(this.get('street'));
    const zip = this.get('zip');
    $.getJSON(`/api/district-from-address?street=${street}&zip=${zip}`)
      .then(district => {
        this.get('router').transitionTo('district', district.id);
      });
  }
});
