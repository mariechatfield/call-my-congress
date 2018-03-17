import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  message: service(),

  actions: {
    linkToIndex() {
      this.transitionToRoute('index');
    }
  }
});
