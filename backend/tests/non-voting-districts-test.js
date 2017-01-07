const { zipCodeToNonVotingUSPSCode } = require('../app/non-voting-districts');
const assert = require('assert');

describe('zipCodeToNonVotingUSPSCode', function() {
  describe('with valid input', function() {
    it('returns the correct abbreviation', function() {
      assert.equal(zipCodeToNonVotingUSPSCode(96799), 'AS', 'zip code matches exactly');
      assert.equal(zipCodeToNonVotingUSPSCode(20001), 'DC', 'zip code at start of range');
      assert.equal(zipCodeToNonVotingUSPSCode(799),   'PR', 'zip code at end of range');
      assert.equal(zipCodeToNonVotingUSPSCode(96930), 'GU', 'zip code inside of range');
      assert.equal(zipCodeToNonVotingUSPSCode(96953), null, 'zip code at range + 1');
      assert.equal(zipCodeToNonVotingUSPSCode(91403), null, 'zip code does not match any non-voting districts');
    });
  });
});