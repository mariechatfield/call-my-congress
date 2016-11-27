export default {
  general: {
    phone: 'Phone',
    twitter: 'Twitter'
  },

  format: {
    name: '{{title}} {{firstName}} {{lastName}}'
  },

  lookupCongress: {
    search: 'Find My Congress'
  },

  displayCongress: {
    back: 'Search Again',
    permalink: 'Permanent Link to This Page'
  },

  geography: {
    address: 'Street Address',
    district: 'Congressional District',
    state: 'State',
    zipCode: 'Zip Code'
  },

  congress: {
    partyAffiliation: 'Party Affiliation',
    votingRecord: 'Voting Record',
    govTrack: 'GovTrack Record'
  },

  about: {
    attribution: "This app runs off data made freely available by the {{link-census}}US Census Geocoding Services{{/link-census}} and {{link-govtrack}}GovTrack.us{{/link-govtrack}}. It was created by {{link-marie}}Marie Chatfield{{/link-marie}}. View the source code or contribute changes on {{link-github}}GitHub{{/link-github}}."
  },

  errors: {
    general: 'Something went wrong.',
    server: {
      INVALID_ADDRESS: 'Could not find valid address. Please double check the street address and zip code.',
      INVALID_DISTRICT: 'District number provided does not exist in your state.',
      INVALID_DISTRICT_ID: 'Provided URL does not map to a valid state and district number.',
      INVALID_STATE: 'State abbreviation provided does not match any known states.',
      MISSING_ZIP: 'Please provide a valid zip code.',
      MISSING_DISTRICT_ID: 'Please provide a valid district id to look up representatives.',
      UNKNOWN: 'Something went wrong.'
    }
  }
};
