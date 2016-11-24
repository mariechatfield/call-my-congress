import Ember from 'ember';
import $ from 'jquery';

export default Ember.Route.extend({
  model(params) {
    return $.getJSON(`/lookup/congress-from-district?id=${params.district_id}`);
  }
});
