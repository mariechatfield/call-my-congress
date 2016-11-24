import Ember from 'ember';
import $ from 'jquery';

export default Ember.Route.extend({
  model(params) {
    return $.ajax(`/lookup/congress-from-district?id=${params.district_id}`)
      .then(model => {
        return JSON.parse(model);
      });
  }
});
