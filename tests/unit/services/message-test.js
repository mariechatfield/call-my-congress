import { moduleFor, test } from 'ember-qunit';
import setupStubs from '../../helpers/setup-stubs';

moduleFor('service:message', 'Unit | Service | message', {
  beforeEach() {
    this.stubs = setupStubs([
      {
        name: 'i18n',
        methodOverrides: [
          {
            name: 'exists',
            override: () => this.isKeyDefined
          }
        ]
      }
    ]);

    this.service = this.subject();
    this.service.set('i18n', this.stubs.objects.i18n);
  }
});

test('returns fully qualified key if it exists', function(assert) {
  this.isKeyDefined = true;

  const error = {
    responseJSON: {
      translationKey: 'SOME_ERROR'
    }
  };

  this.service.displayFromServer(error);
  assert.equal(this.service.get('messageKey'), 'errors.server.SOME_ERROR');

  this.isKeyDefined = false;
  this.service.displayFromServer(error);
  assert.equal(this.service.get('messageKey'), 'errors.general');
});

test('gracefully handles malformed error', function(assert) {
  this.service.displayFromServer('not a valid error object');
  assert.equal(this.service.get('messageKey'), 'errors.general');

  this.service.displayFromServer({});
  assert.equal(this.service.get('messageKey'), 'errors.general');

  this.service.displayFromServer({ responseJSON: {} });
  assert.equal(this.service.get('messageKey'), 'errors.general');

  this.service.displayFromServer({ responseJSON: { someOtherKey: 'hello' } });
  assert.equal(this.service.get('messageKey'), 'errors.general');
});
