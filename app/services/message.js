import Service, { inject as service } from '@ember/service';

const MESSAGE_DURATION = 7000;

export default Service.extend({
  intl: service(),
  messageKey: null,
  isVisible: false,

  display(messageKey) {
    this.setProperties({
      messageKey,
      isVisible: true
    });
  },

  clear() {
    this.setProperties({
      messageKey: null,
      isVisible: false
    });
  },

  flash(messageKey) {
    this.display(messageKey);
    setTimeout(() => this.clear(), MESSAGE_DURATION);
  },

  displayFromServer(error) {
    if (error && error.translationKey) {
      const partialKey = error.translationKey;
      const fullKey = `errors.server.${partialKey}`;

      if (this.get('intl').exists(fullKey)) {
        this.display(fullKey);
        return;
      }
    }

    this.display('errors.general');
  }
});
