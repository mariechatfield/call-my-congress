import { computed } from '@ember/object';
import { alias, or, and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  message: service(),
  lookupData: service(),

  congress: null,

  // We can assume only one district per congress response from the server
  district: alias('congress.district.districts.firstObject'),

  hasRepresentativesOrSenators: or(
    'congress.representatives.length',
    'congress.senators.length'
  ),

  successfulLoad: and(
    'district.id',
    'hasRepresentativesOrSenators'
  ),

  permalink: computed('district.id', function() {
    return `https://www.callmycongress.com/${this.get('district.id')}`;
  }),

  actions: {
    returnHome() {
      this.get('message').clear();
      this.get('lookupData').clear();
      this.get('router').transitionTo('index');
    }
  }
});
