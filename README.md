# Call My Congress

[![Greenkeeper badge](https://badges.greenkeeper.io/mchat/call-my-congress.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/mchat/call-my-congress.svg?branch=master)](https://travis-ci.org/mchat/call-my-congress)

Call My Congress is a small application that helps US citizens quickly find contact information for their congressional representatives.

It is built using data freely provided by the [US Census Geocoding Services](https://geocoding.geo.census.gov/) and [ProPublica](https://www.propublica.org/datastore/apis).

The app consists of an Ember client app and an Express server. All the front end application code can be found in [`app/`](app/). The back end application code can be found in [`backend/app/`](backend/app/).

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Ember CLI](http://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone https://github.com/mchat/call-my-congress.git` this repository
* `cd call-my-congress`
* `npm install`

## Running / Development

Since this application includes both a front end and a back end, you will need to start up two servers to begin development.

*Note: Running the backend requires access to ProPublica. You'll need access to an API key to make valid requests.*

* `PROPUBLICA_API_KEY=[...] npm run backend`
* `npm run frontend`
* Visit [http://localhost:4200](http://localhost:4200) to see the app running locally.

Both of these servers will automatically reload whenever you save changes.

### Running Tests

To run all tests once (used for Travis CI builds):
* `npm test`

This runs both the front end and back end test suites. You can also run either suite just once with:
* `npm run test:backend`
* `npm run test:frontend`

To develop against tests:
* `npm run test-server:backend`
* `npm run test-server:frontend`

This will start a test server for the test suite in question, and will reload your tests whenever you save either app or test code.

Pro tip for front end tests: the tests will be opened in your browser. You can use the `filter` query param to run a subset of tests. I.e. `?filter=Integration | Component` will only run the component integration tests.

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Changes pushed to master are automatically deployed to Heroku once they have a passing build.

This app is deployed to two separate dynos on Heroku. The first (`call-my-congress`) is configured to run only the front end Ember application. The second (`call-my-congress-backend`) runs the Express server.

`call-my-congress` proxies all `/api/` requests to `call-my-congress-backend`, which is defined in [`static.json`](static.json).

### Contributing

PRs and improvements are welcome! If you'd like to contribute but aren't sure where to start, here's a short wish list of small contributions:

* Improve high-level documentation (particularly around getting started or running locally)
* Document a component with its expected inputs and behavior
* Add another test for a case that's missing
* Try out the app on a different browser or operating system, and if there are any bugs then [file an issue](../../issues) and consider trying to fix it
* Translate helper text and error messages into a new language ([original English strings](app/locales/en/translations.js))
