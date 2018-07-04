import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  lookupData: service(),
  message: service(),

  actions: {
    lookupCongress(event) {
      event.preventDefault();
      this.get('message').clear();

      if (isEmpty(this.get('lookupData.zip'))) {
        this.get('message').display('errors.server.MISSING_ZIP');
        return;
      }

      this.get('router').transitionTo('search.lookup');
    }
  }
});
