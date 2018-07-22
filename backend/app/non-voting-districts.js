/* eslint-env node */

const AMERICAN_SAMOA_CODE = 'AS';
const GUAM_CODE = 'GU';
const NORTHERN_MARIANA_ISLANDS_CODE = 'MP';
const PUERTO_RICO_CODE = 'PR';
const US_VIRGIN_ISLANDS_CODE = 'VI';
const WASHINGTON_DC_CODE = 'DC';

/**
 * Given a zip code, return the USPS abbreviation of the non-voting congressional
 * district to which it belongs. If none, return null.
 *
 * @param  {number} zipCode The numeric zip code (postal code) to check.
 * @return {?string}        Two-digit USPS abbreviation, or null.
 */
function zipCodeToNonVotingUSPSCode(zipCode) {
  const inRange = (min, max) => zipCode >= min && zipCode <= max;

  // Washington DC: 20001-20098, 20201-20599
  if (inRange(20001, 20008) || inRange(20201, 20599)) {
    return WASHINGTON_DC_CODE;
  }

  // Puerto Rico: 00600-00799, 00900-00999
  if (inRange(600, 799) || inRange(900, 999)) {
    return PUERTO_RICO_CODE;
  }

  // American Samoa: 96799
  if (zipCode === 96799) {
    return AMERICAN_SAMOA_CODE;
  }

  // Guam: 96910–96932
  if (inRange(96910, 96932)) {
    return GUAM_CODE;
  }

  // Northern Mariana Islands: 96950–96952
  if (inRange(96950, 96952)) {
    return NORTHERN_MARIANA_ISLANDS_CODE;
  }

  // US Virgin Islands:
  // 00801–00805, 00820–00824, 00830–00831, 00840–00841, 00850–00851
  if (inRange(801, 805) || inRange(820, 824) || inRange(830, 831) ||
      inRange(840, 841) || inRange(850, 851)) {
    return US_VIRGIN_ISLANDS_CODE;
  }

  return null;
}

module.exports = {
  zipCodeToNonVotingUSPSCode
};