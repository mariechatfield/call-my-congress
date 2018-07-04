import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('district', { path: '/:district_id'});
  this.route('search', { path: '/' }, function() {
    this.route('lookup');
    this.route('pick-district');
  });
});

export default Router;
