import Ember from 'ember';
import $ from 'jquery';

export default Ember.Route.extend({
  message: Ember.inject.service(),

  model(params) {
    return $.getJSON(`/api/congress-from-district?id=${params.district_id}`)
      .catch(error => this.get('message').displayFromServer(error));
  }
});
