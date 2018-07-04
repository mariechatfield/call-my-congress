import Component from '@ember/component';
import FocusingMixin from 'ember-a11y/mixins/focusing';

export default Component.extend(FocusingMixin, {
  shouldFocus: true
});
