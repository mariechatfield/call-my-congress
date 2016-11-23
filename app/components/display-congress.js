import Ember from 'ember';
import $ from 'jquery';

export default Ember.Component.extend({
  street: null,
  zip: null,
  
  representatives: null,
  senators: null,

  actions: {
    lookupGeography() {
      const street = encodeURI(this.get('street'));
      const zip = this.get('zip');
      $.ajax(`/lookup?street=${street}&zip=${zip}`)
        .then(result => {
          const congress = JSON.parse(result);
          this.setProperties({
            representatives: congress.representatives,
            senators: congress.senators
          });
        });
    }
  }

});
