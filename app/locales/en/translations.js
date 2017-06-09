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

  pickDistrict: {
    helpText: 'Your zip code falls within multiple congressional districts. Pick a district below to see its representatives, or provide a street address and search again for more accurate results.'
  },

  displayCongress: {
    back: 'Search Again',
    permalink: 'Permanent Link to This Page',
    disclaimerTitle: "Where did all the other data go? Can we get more data?",
    disclaimerBody: `This site previously used data generously provided for free by {{link-govtrack}}GovTrack.us{{/link-govtrack}}, a project run by citizens who care about government transparency.
      Unfortunately, GovTrack.us is no longer able to support providing other projects with free access to data, but you can still use their site directly to track your representatives' voting records and participation in Congress.
      CallMyCongress.com now runs entirely off data provided directly by the US Government, which is more limited.`
  },

  geography: {
    address: 'Street Address',
    district: 'Congressional District',
    state: 'State',
    zipCode: 'Zip Code'
  },

  congress: {
    partyAffiliation: 'Party Affiliation',
    vacancy: '(Vacant Seat)'
  },

  about: {
    attribution: "This app runs off data made freely available by the {{link-census}}US Census Geocoding Services{{/link-census}}, the {{link-house}}US House of Representatives{{/link-house}}, and the {{link-senate}}US Senate{{/link-senate}}. It was created by {{link-marie}}Marie Chatfield{{/link-marie}}. View the source code or contribute changes on {{link-github}}GitHub{{/link-github}}."
  },

  errors: {
    general: 'Something went wrong.',
    server: {
      INVALID_ADDRESS: 'Could not find valid address. Please double check the street address and zip code.',
      INVALID_DISTRICT: 'District number provided does not exist in your state.',
      INVALID_DISTRICT_ID: 'Provided URL does not map to a valid state and district number.',
      INVALID_STATE: 'State abbreviation provided does not match any known states.',
      MISSING_ZIP: 'Please provide a valid zip code.',
      MISSING_STREET: 'Please provide a street address. CallMyCongress.com no longer supports zip-only searches, as the source of our data for zip code to congressional districts was shut down. We apologize for the inconvenience.',
      MISSING_DISTRICT_ID: 'Please provide a valid district id to look up representatives.',
      UNKNOWN: 'Something went wrong.'
    }
  }
};
