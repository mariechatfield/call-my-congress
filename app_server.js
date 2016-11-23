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
    const address = result.result.addressMatches[0];
    const number = address.geographies['115th Congressional Districts'][0].BASENAME;
    const state = address.addressComponents.state;

    return { number, state };
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

app.get('/lookup', (req, res) => {
  try {
    getDistricts(req.query)
      .then(district => Promise.all([getRepresentatives(district), getSenators(district)]))
      .then(congress => {
        const representatives = congress[0].representatives;
        const senators = congress[1].senators;
        res.send(JSON.stringify({ representatives, senators }));
      })
      .catch(err => res.status(500).send(err));
  } catch (err) {
    res.status(500).send('Something went wrong!');
  }
});

app.listen(3000);