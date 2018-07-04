import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupStubs from 'call-my-congress/tests/helpers/setup-stubs';

const STREET = '1600 Pennsylvania Ave';
const ZIP = '20500';

module('Unit | Component | lookup congress', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.stubs = setupStubs([
      {
        name: 'router',
        methods: ['transitionTo']
      }, {
        name: 'message',
        methods: ['clear', 'display', 'displayFromServer']
      }, {
        name: 'lookupData'
      }, {
        name: 'event',
        methods: ['preventDefault']
      }
    ]);

    this.component = this.owner.factoryFor('component:lookup-congress').create();
    this.component.setProperties({
      message: this.stubs.objects.message,
      lookupData: this.stubs.objects.lookupData,
      router: this.stubs.objects.router,
    });
  });

  module('lookupCongress', function() {
    test('displays error if no zip', function(assert) {
      this.component.set('lookupData', {
        street: STREET
      });

      this.component.send('lookupCongress', this.stubs.objects.event);
      assert.equal(this.stubs.calls.message.clear.length, 1, 'clears messages first');
      assert.equal(this.stubs.calls.message.display.length, 1, 'displays message');
      assert.deepEqual(this.stubs.calls.message.display[0], ['errors.server.MISSING_ZIP'], 'displays missing zip message for undefined zip');

      this.component.set('lookupData.zip', '');

      this.component.send('lookupCongress', this.stubs.objects.event);
      assert.equal(this.stubs.calls.message.clear.length, 2, 'clears messages first');
      assert.equal(this.stubs.calls.message.display.length, 2, 'displays another message');
      assert.deepEqual(this.stubs.calls.message.display[1], ['errors.server.MISSING_ZIP'], 'displays missing zip message for empty string zip');
    });

    test('transitions to lookup route if zip', function(assert) {
      this.component.set('lookupData', {
        zip: ZIP
      });

      this.component.send('lookupCongress', this.stubs.objects.event);
      assert.equal(this.stubs.calls.message.display.length, 0, 'does not display message');
      assert.equal(this.stubs.calls.router.transitionTo.length, 1, 'calls transitionTo');
      assert.deepEqual(this.stubs.calls.router.transitionTo[0], ['search.lookup'], 'transitions to lookup route');
    });
  });
});
