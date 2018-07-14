/* jshint node: true */
/* global Promise */

const request = require('request');
const express = require('express');
const querystring = require('querystring');
const app = express();

const { zipCodeToNonVotingUSPSCode } = require('./non-voting-districts');

const CURRENT_CONGRESS = 115;

const HOUSE_BASE_URL = `https://api.propublica.org/congress/v1/${CURRENT_CONGRESS}/house/members.json`;
const SENATOR_BASE_URL = `https://api.propublica.org/congress/v1/${CURRENT_CONGRESS}/senate/members.json`;
const GEOGRAPHY_BASE_URL = 'https://geocoding.geo.census.gov/geocoder/geographies/address';
const ZIP_ONLY_BASE_URL = 'http://whoismyrepresentative.com/getall_mems.php';

// When zip code is not found, the response succeeds with code 200 but the body
// has this message instead of a JSON object.
const ZIP_ONLY_ERROR_BODY = `<result message='No Data Found' />`;

const AT_LARGE_DISTRICT_NAME = '(at Large)';
const AT_LARGE_DISTRICT_NUMBER = 0;

const PROPUBLICA_HEADERS = {
  'X-API-Key': process.env.PROPUBLICA_API_KEY
};

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

function getPartyName(shorthand) {
  switch(shorthand) {
    case 'D': return 'Democrat';
    case 'R': return 'Republican';
    default: return shorthand;
  }
}

function performGETRequest(options, processResult, attemptParse = true) {
  return new Promise((resolve, reject) => {
    request.get(options, function (error, response, body) {
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

  return performGETRequest({ url: buildURL(ZIP_ONLY_BASE_URL, params) }, body => {

    if (body === ZIP_ONLY_ERROR_BODY) {
      // Current API used for zip-only addresses does not handle non-voting
      // congressional districts. Manually verify if the given zip belongs
      // to a non-voting district, and if so return that district. Otherwise,
      // zip code does not map to any district and is invalid.
      const state = zipCodeToNonVotingUSPSCode(geography.zip);

      if (state !== null) {
        const number = AT_LARGE_DISTRICT_NUMBER;

        return {
          districts: [
            {
              state,
              number,
              id: `${state}-${number}`
            }
          ]
        };
      }

      throw new AppError('INVALID_ADDRESS');
    }

    const result = JSON.parse(body);
    const state = result.results[0].state;

    const districtNumbers = result.results
      .map(representative => representative.district)
      // Filter out all non-numeric districts (i.e. "Junior Seat" for senators)
      .filter(district => district && !isNaN(district));

    if (state && districtNumbers.length === 0) {
      districtNumbers.push(AT_LARGE_DISTRICT_NUMBER);
    }

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

  return performGETRequest({ url: buildURL(GEOGRAPHY_BASE_URL, params) }, result => {
    if (result.result.addressMatches.length === 0) {
      throw new AppError('INVALID_ADDRESS');
    }

    const address = result.result.addressMatches[0];
    let number = address.geographies['115th Congressional Districts'][0].BASENAME;
    const state = address.addressComponents.state;

    if (state && number.match(AT_LARGE_DISTRICT_NAME)) {
      number = AT_LARGE_DISTRICT_NUMBER;
    }

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
  const districtIsAtLarge = district.number === AT_LARGE_DISTRICT_NUMBER;

  return performGETRequest({ url: HOUSE_BASE_URL, headers: PROPUBLICA_HEADERS }, result => {
    const allMembers = result.results[0].members;

    const repsForDistrict = allMembers.filter(member => {
      return member.state === district.state && (districtIsAtLarge || Number(member.district) === district.number);
    });

    const representatives = repsForDistrict.map(representative => {
      const data = {
        title: 'Rep.',
        person: {
          firstname: representative.first_name,
          lastname: representative.last_name,
        },
        party: getPartyName(representative.party),
        phone: representative.phone,
        twitter: representative.twitter_account,
        govtrack: representative.govtrack_id,
        cspan: representative.cspan_id,
        next_election: representative.next_election
      };

      if (representative.in_office === false || representative.in_office === 'false') {
        data.vacant = true;
      }

      return data;
    });

    return { representatives };
  });
}


function getSenators(districts) {
  const district = districts.districts[0];

  return performGETRequest({ url: SENATOR_BASE_URL, headers: PROPUBLICA_HEADERS }, result => {
    const allMembers = result.results[0].members;
    const senatorsForDistrict = allMembers.filter(member => member.state === district.state);

    const senators = senatorsForDistrict.map(senator => {
      const data = {
        title: 'Sen.',
        person: {
          firstname: senator.first_name,
          lastname: senator.last_name,
        },
        party: getPartyName(senator.party),
        phone: senator.phone,
        twitter: senator.twitter_account,
        govtrack: senator.govtrack_id,
        cspan: senator.cspan_id,
        next_election: senator.next_election
      };

      if (senator.in_office === false || senator.in_office === "false") {
        data.vacant = true;
      }

      return data;
    });

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

    return { representatives, senators, district };
  });
}

app.get('/api/district-from-address', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (!req.query.zip) {
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

    const stateNumberPattern = /^([a-zA-z]{2})-?([0-9]+)$/;
    const match = districtID.match(stateNumberPattern);

    if (match === null) {
      res.status(400).send({ translationKey: 'INVALID_DISTRICT_ID'});
      return;
    }

    const [, state, rawNumber] = match;
    const number = Number(rawNumber);
    const district = {
      districts: [
        { state, number, id: `${state}-${number}` }
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