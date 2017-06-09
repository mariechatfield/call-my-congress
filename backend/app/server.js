/* jshint node: true */
/* global Promise */

const request = require('request');
const express = require('express');
const querystring = require('querystring');
const convert = require('xml-js');
const app = express();

const HOUSE_BASE_URL = 'http://clerk.house.gov/xml/lists/MemberData.xml';
const SENATOR_BASE_URL = 'https://www.senate.gov/general/contact_information/senators_cfm.xml';
const GEOGRAPHY_BASE_URL = 'https://geocoding.geo.census.gov/geocoder/geographies/address';

const AT_LARGE_DISTRICT_NAME = '(at Large)';
const AT_LARGE_DISTRICT_NUMBER = 0;

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

function getFormattedDistrictNumber(number) {
  // Prefix number with a leading zero, but return only the last two digits
  // e.g. '00' or '12' or '09'.
  return `0${number}`.slice(-2);
}

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
  const districtNumber = getFormattedDistrictNumber(district.number);
  const districtID = `${district.state}${districtNumber}`;

  return performGETRequest(HOUSE_BASE_URL, result => {
    const responseData = convert.xml2js(result, { compact: true });
    const allMembers = responseData.MemberData.members.member;
    const repsForDistrict = allMembers.filter(member => member.statedistrict._text === districtID);

    const representatives = repsForDistrict.map(representative => {
      const data = {
        title: 'Rep.',
        person: {
          firstname: representative['member-info'].firstname._text,
          lastname: representative['member-info'].lastname._text,
        },
        party: getPartyName(representative['member-info'].party._text),
        phone: representative['member-info'].phone._text
      };

      if (representative['member-info'].footnote) {
        data.vacant = true;
        data.footnote = representative['member-info'].footnote._text;
      }

      return data;
    });

    return { representatives };
  }, false);
}


function getSenators(districts) {
  const district = districts.districts[0];

  return performGETRequest(SENATOR_BASE_URL, result => {
    const responseData = convert.xml2js(result, { compact: true });
    const allMembers = responseData.contact_information.member;
    const senatorsForDistrict = allMembers.filter(member => member.state._text === district.state);

    const senators = senatorsForDistrict.map(senator => ({
      title: 'Sen.',
      person: {
        firstname: senator.first_name._text,
        lastname: senator.last_name._text,
      },
      party: getPartyName(senator.party._text),
      phone: senator.phone._text
    }));

    return { senators };
  }, false);
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

  if (req.query.zip === undefined || req.query.zip === null) {
    res.status(400).send({ translationKey: 'MISSING_ZIP' });
    return;
  }

  if (req.query.street === undefined || req.query.street === null) {
    res.status(400).send({ translationKey: 'MISSING_STREET' });
    return;
  }

  try {
    getDistricts(req.query)
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