/* jshint node: true */
/* global Promise */

const request = require('request');
const express = require('express');
const querystring = require('querystring');
const app = express();

const GEOGRAPHY_BASE_URL = 'https://geocoding.geo.census.gov/geocoder/geographies/address';
const ROLE_BASE_URL = 'https://www.govtrack.us/api/v2/role';

// Geography layer that includes information on the 115th Congressional Districts
// as defined: https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer/54
const CONGRESSIONAL_DISTRICTS_LAYER = 54;

function buildURL(base, params) {
  return `${base}?${querystring.stringify(params)}`;
}

function performGETRequest(url, processResult) {
  return new Promise((resolve, reject) => {
    request(url, function (error, response, body) {
      try {
        if (!error && response.statusCode === 200) {
          const result = JSON.parse(body);
          resolve(processResult(result));
        } else {
          reject(error);
        }
      } catch (error) {
        reject(error);
      }
    });
  });
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
      throw new Error('INVALID_ADDRESS');
    }

    const address = result.result.addressMatches[0];
    const number = address.geographies['115th Congressional Districts'][0].BASENAME;
    const state = address.addressComponents.state;

    const id = `${state}-${number}`;

    return { number, state, id };
  });
}

function getRepresentatives(district) {
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


function getSenators(district) {
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
      throw new Error('INVALID_STATE');
    }

    if (representatives.length === 0) {
      throw new Error('INVALID_DISTRICT');
    }

    return { representatives, senators, district };
  });
}

app.get('/api/district-from-address', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.query.street === undefined || req.query.street === null ||
      req.query.zip === undefined || req.query.zip === null) {
    res.status(400).send({ translationKey: 'INCOMPLETE_ADDRESS' });
    return;
  }

  try {
    getDistricts(req.query)
      .then(district => res.send(district))
      .catch(err => res.status(500).send({ translationKey: err.message }));
  } catch (err) {
    res.status(500).send();
  }
});

app.get('/api/congress-from-district', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    const districtID = req.query.id;
    const stateNumberPattern = /^([a-zA-z]{2})-([0-9]+)$/;
    const match = districtID.match(stateNumberPattern);

    if (match === null) {
      res.status(400).send({ translationKey: 'INVALID_DISTRICT_ID'});
      return;
    }

    const [, state, number] = match;

    buildCongress({ state, number, id: districtID })
      .then(congress => res.send(congress))
      .catch(err => res.status(500).send({ translationKey: err.message }));
  } catch (err) {
    res.status(500).send();
  }
});

app.listen(process.env.PORT);