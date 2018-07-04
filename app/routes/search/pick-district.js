import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  lookupData: service(),

  beforeModel() {
    if (!this.get('lookupData.districtsToPickFrom')) {
      this.replaceWith('search');
    }
  }
});
