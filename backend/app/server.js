/* jshint node: true */
/* global Promise */

const request = require('request');
const express = require('express');
const querystring = require('querystring');
const app = express();

const GEOGRAPHY_BASE_URL = 'https://geocoding.geo.census.gov/geocoder/geographies/address';
const ZIP_ONLY_BASE_URL = 'http://whoismyrepresentative.com/getall_mems.php';
const ROLE_BASE_URL = 'https://www.govtrack.us/api/v2/role';

// When zip code is not found, the response succeeds with code 200 but the body
// has this message instead of a JSON object.
const ZIP_ONLY_ERROR_BODY = `<result message='No Data Found'/>`;

const DEFAULT_PORT = 3000;

// Geography layer that includes information on the 115th Congressional Districts
// as defined: https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer/54
const CONGRESSIONAL_DISTRICTS_LAYER = 54;

function buildURL(base, params) {
  return `${base}?${querystring.stringify(params)}`;
}

function AppError(message) {
  this.name = 'AppError';
  this.message = message || 'Default Message';
  this.stack = (new Error()).stack;
}
AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

function performGETRequest(url, processResult, attemptParse = true) {
  return new Promise((resolve, reject) => {
    request.get(url, function (error, response, body) {
      try {
        if (!error && response.statusCode === 200) {
          if (attemptParse) {
            const result = JSON.parse(body);
            resolve(processResult(result));
          } else {
            resolve(processResult(body));
          }
        } else {
          reject(error);
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}

function getDistrictsZipOnly(geography) {
  const params = {
    output: 'json',
    zip: geography.zip
  };

  return performGETRequest(buildURL(ZIP_ONLY_BASE_URL, params), body => {
    if (body === ZIP_ONLY_ERROR_BODY) {
      throw new AppError('INVALID_ADDRESS');
    }

    const result = JSON.parse(body);
    const state = result.results[0].state;

    const districtNumbers = result.results
      .map(representative => representative.district)
      // Filter out all non-numeric districts (i.e. "Junior Seat" for senators)
      .filter(district => !isNaN(district));

    const districts = districtNumbers.map(number => {
      return {
        state,
        number,
        id: `${state}-${number}`
      };
    });

    return { districts };
  }, false);
}

function getDistricts(geography) {
  const params = {
    benchmark: 'Public_AR_Current',
    vintage: 'Current_Current',
    format: 'json',
    layers: CONGRESSIONAL_DISTRICTS_LAYER,
    street: geography.street,
    zip: geography.zip
  };

  return performGETRequest(buildURL(GEOGRAPHY_BASE_URL, params), result => {
    if (result.result.addressMatches.length === 0) {
      throw new AppError('INVALID_ADDRESS');
    }

    const address = result.result.addressMatches[0];
    const number = address.geographies['115th Congressional Districts'][0].BASENAME;
    const state = address.addressComponents.state;

    const id = `${state}-${number}`;

    return {
      districts: [
        { number, state, id }
      ]
    };
  });
}

function getRepresentatives(districts) {
  const district = districts.districts[0];
  const params = {
    current: true,
    district: district.number,
    state: district.state
  };

  return performGETRequest(buildURL(ROLE_BASE_URL, params), result => {
    const representatives = result.objects;

    return { representatives };
  });
}


function getSenators(districts) {
  const district = districts.districts[0];
  const params = {
    current: true,
    role_type: 'senator',
    state: district.state
  };

  return performGETRequest(buildURL(ROLE_BASE_URL, params), result => {
    const senators = result.objects;

    return { senators };
  });
}

function buildCongress(district) {
  return Promise.all([
    getRepresentatives(district),
    getSenators(district),
    Promise.resolve(district)
  ])
  .then(congress => {
    const representatives = congress[0].representatives;
    const senators = congress[1].senators;
    const district = congress[2];

    if (senators.length === 0 && representatives.length === 0) {
      throw new AppError('INVALID_STATE');
    }

    if (representatives.length === 0) {
      throw new AppError('INVALID_DISTRICT');
    }

    return { representatives, senators, district };
  });
}

app.get('/api/district-from-address', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.query.zip === undefined || req.query.zip === null) {
    res.status(400).send({ translationKey: 'MISSING_ZIP' });
    return;
  }

  const getDistrictsFunction = req.query.street ? getDistricts : getDistrictsZipOnly;

  try {
    getDistrictsFunction(req.query)
      .then(district => res.send(district))
      .catch(err => {
        const translationKey = err instanceof AppError ? err.message : 'UNKNOWN';
        res.status(500).send({ translationKey });
      });
  } catch (err) {
    res.status(500).send({ translationKey: 'UNKNOWN' });
  }
});

app.get('/api/congress-from-district', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    const districtID = req.query.id;

    if (districtID === undefined) {
      res.status(400).send({ translationKey: 'MISSING_DISTRICT_ID'});
      return;
    }

    const stateNumberPattern = /^([a-zA-z]{2})-([0-9]+)$/;
    const match = districtID.match(stateNumberPattern);

    if (match === null) {
      res.status(400).send({ translationKey: 'INVALID_DISTRICT_ID'});
      return;
    }

    const [, state, number] = match;
    const district = {
      districts: [
        { state, number, id: districtID }
      ]
    };

    buildCongress(district)
      .then(congress => res.send(congress))
      .catch(err => {
        const translationKey = err instanceof AppError ? err.message : 'UNKNOWN';
        res.status(500).send({ translationKey });
      });
  } catch (err) {
    res.status(500).send({ translationKey: 'UNKNOWN' });
  }
});

const server = app.listen(process.env.PORT || DEFAULT_PORT, function () {
  const port = server.address().port;
  console.log(`CallMyCongress server listening at port ${port}`);
});

module.exports = server;