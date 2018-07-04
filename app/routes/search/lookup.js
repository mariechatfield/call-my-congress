import Route from '@ember/routing/route';
import $ from 'jquery';
import { inject as service } from '@ember/service';

export default Route.extend({
  lookupData: service(),
  message: service(),

  beforeModel() {
    if (!this.get('lookupData.street') && !this.get('lookupData.zip')) {
      this.replaceWith('search');
    }
  },

  model() {
    const street = this.get('lookupData.street');
    const zip = this.get('lookupData.zip');

    let url;

    if (street) {
      const encodedStreet = encodeURI(street);
      url = `/api/district-from-address?street=${encodedStreet}&zip=${zip}`;
    } else {
      url = `/api/district-from-address?zip=${zip}`;
    }

    return $.getJSON(url).catch(error => {
      this.get('message').displayFromServer(error);
      this.replaceWith('search');
    });
  },

  afterModel(model) {
    if (model.districts) {
      if (model.districts.length === 1) {
        this.transitionTo('district', model.districts[0].id);
        return;
      } else if (model.districts.length > 1) {
        this.set('lookupData.districtsToPickFrom', model.districts);
        this.transitionTo('search.pick-district');
        return;
      }
    }

    this.get('message').display('errors.general');
    this.replaceWith('search');
  }
});
