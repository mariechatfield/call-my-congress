/* eslint-env node */
/* global Promise */

const { zipCodeToNonVotingUSPSCode } = require('./non-voting-districts');
const { getValueFromCache, storeValueInCache, MILLISECONDS_IN_DAY, MILLISECONDS_IN_WEEK } = require('./cache');
const { buildURL, performGETRequest } = require('./utils');

const CURRENT_CONGRESS = 115;
const HOUSE_BASE_URL = `https://api.propublica.org/congress/v1/${CURRENT_CONGRESS}/house/members.json`;
const SENATOR_BASE_URL = `https://api.propublica.org/congress/v1/${CURRENT_CONGRESS}/senate/members.json`;
const ZIP_ONLY_BASE_URL = 'http://whoismyrepresentative.com/getall_mems.php';

const PROPUBLICA_HEADERS = {
  'X-API-Key': process.env.PROPUBLICA_API_KEY
};

// When zip code is not found, the response succeeds with code 200 but the body
// has this message instead of a JSON object.
const ZIP_ONLY_ERROR_BODY = `<result message='No Data Found' />`;
const AT_LARGE_DISTRICT_NUMBER = 0;

const REPRESNTATIVES_CACHE_KEY = 'HOUSE_OF_REPRESENTATIVES';
const SENATORS_CACHE_KEY = 'SENATE';

function fetchAllRepresentatives() {
  const cachedRepresentatives = getValueFromCache(REPRESNTATIVES_CACHE_KEY);

  if (cachedRepresentatives) {
    return new Promise((resolve) => resolve(cachedRepresentatives));
  }

  return performGETRequest({ url: HOUSE_BASE_URL, headers: PROPUBLICA_HEADERS }, result => {
    const allMembers = result.results[0].members;

    storeValueInCache(REPRESNTATIVES_CACHE_KEY, allMembers, MILLISECONDS_IN_DAY);

    return allMembers;
  });
}

function fetchAllSenators() {
  const cachedSenators = getValueFromCache(SENATORS_CACHE_KEY);

  if (cachedSenators) {
    return new Promise((resolve) => resolve(cachedSenators));
  }

  return performGETRequest({ url: SENATOR_BASE_URL, headers: PROPUBLICA_HEADERS }, result => {
    const allMembers = result.results[0].members;

    storeValueInCache(SENATORS_CACHE_KEY, allMembers, MILLISECONDS_IN_DAY);

    return allMembers;
  });
}

function fetchDistrictsForZip(zip) {
  const zipCacheKey = `ZIP_${zip}`;
  const cachedDistricts = getValueFromCache(zipCacheKey);

  if (cachedDistricts) {
    return new Promise((resolve) => resolve(cachedDistricts));
  }

  const params = { output: 'json', zip };

  return performGETRequest({ url: buildURL(ZIP_ONLY_BASE_URL, params) }, rawResult => {
    const districts = transformZipResultToDistricts(rawResult, zip);

    if (!districts) {
      return null;
    }

    storeValueInCache(zipCacheKey, districts, MILLISECONDS_IN_WEEK);
    return districts;
  });
}

function transformZipResultToDistricts(body, zip) {
  if (body === ZIP_ONLY_ERROR_BODY) {
    // Current API used for zip-only addresses does not handle non-voting
    // congressional districts. Manually verify if the given zip belongs
    // to a non-voting district, and if so return that district. Otherwise,
    // zip code does not map to any district and is invalid.
    const state = zipCodeToNonVotingUSPSCode(zip);

    if (state !== null) {
      const number = AT_LARGE_DISTRICT_NUMBER;

      return [
        {
          state,
          number,
          id: `${state}-${number}`
        }
      ];
    }

    // Zip cannot be mapped to a valid district.
    return null;
  }

  const result = typeof body === 'string' ? JSON.parse(body) : body;
  const state = result.results[0].state;

  const districtNumbers = result.results
    .map(representative => representative.district)
    // Filter out all non-numeric districts (i.e. "Junior Seat" for senators)
    .filter(district => district && !isNaN(district));

  if (state && districtNumbers.length === 0) {
    districtNumbers.push(AT_LARGE_DISTRICT_NUMBER);
  }

  return districtNumbers.map(number => {
    return {
      state,
      number,
      id: `${state}-${number}`
    };
  });
}

module.exports = {
  fetchAllRepresentatives,
  fetchAllSenators,
  fetchDistrictsForZip,
  transformZipResultToDistricts,
  HOUSE_BASE_URL,
  SENATOR_BASE_URL,
  ZIP_ONLY_BASE_URL
};
