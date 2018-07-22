/* eslint-env node */

const DISTRICT_OBJECT = {
  result: {
    addressMatches: [
      {
        geographies: {
          '115th Congressional Districts': [
            {
              OID: 211904492478597,
              STATE: '06',
              FUNCSTAT: 'N',
              NAME: 'Congressional District 12',
              AREAWATER: 211581427,
              CDSESSN: '115',
              LSADC: 'C2',
              CENTLON: '-122.4347034',
              BASENAME: '12',
              INTPTLAT: '+37.7855141',
              MTFCC: 'G5200',
              GEOID: '0612',
              CENTLAT: '+37.7853375',
              CD115: '12',
              INTPTLON: '-122.4340005',
              AREALAND: 101086653,
              OBJECTID: 118
            }
          ]
        },
        matchedAddress: '1 DR CARLTON P GOODLETT PL, SAN FRANCISCO, CA, 94102',
        coordinates: {
          x: -122.41827,
          y: 37.77863
        },
        tigerLine: {
          tigerLineId: '635441232',
          side: 'L'
        },
        addressComponents: {
          fromAddress: '1',
          toAddress: '99',
          preQualifier: '',
          preDirection: '',
          preType: '',
          streetName: 'DR CARLTON P GOODLETT',
          suffixType: 'PL',
          suffixDirection: '',
          suffixQualifier: '',
          zip: '94102',
          city: 'SAN FRANCISCO',
          state: 'CA'
        }
      }
    ],
    input: {
      address: {
        street: '1 Dr Carlton B Goodlett Pl',
        zip: '94102'
      },
      benchmark: {
        isDefault: false,
        benchmarkDescription: 'Public Address Ranges - Current Benchmark',
        benchmarkName: 'Public_AR_Current',
        id: '4'
      },
      vintage: {
        vintageName: 'Current_Current',
        isDefault: true,
        vintageDescription: 'Current Vintage - Current Benchmark',
        id: '4'
      }
    }
  }
};

const AT_LARGE_DISTRICT_OBJECT = {
  result: {
    input: {
      address: {
        street: '2 Carson St',
        zip: '59601'
      },
      benchmark: {
        id: '4',
        isDefault: false,
        benchmarkName: 'Public_AR_Current',
        benchmarkDescription: 'Public Address Ranges - Current Benchmark'
      },
      vintage: {
        id: '4',
        isDefault: true,
        vintageName: 'Current_Current',
        vintageDescription: 'Current Vintage - Current Benchmark'
      }
    },
    addressMatches: [
      {
        geographies: {
          '115th Congressional Districts': [
            {
              OID: 211904692358327,
              STATE: '30',
              FUNCSTAT: 'N',
              NAME: 'Congressional District (at Large)',
              AREAWATER: 3867533734,
              CDSESSN: '115',
              LSADC: 'C1',
              CENTLON: '-109.6329861',
              BASENAME: 'Congressional District (at Large)',
              INTPTLAT: '+47.0511771',
              MTFCC: 'G5200',
              GEOID: '3000',
              CENTLAT: '+47.0526268',
              CD115: '00',
              INTPTLON: '-109.6348174',
              AREALAND: 376964409491,
              OBJECTID: 417
            }
          ]
        },
        matchedAddress: '2 N CARSON ST, HELENA, MT, 59601',
        coordinates: {
          x: -112.012146,
          y: 46.584167
        },
        tigerLine: {
          side: 'L',
          tigerLineId: '202349954'
        },
        addressComponents: {
          fromAddress: '2',
          toAddress: '98',
          preQualifier: '',
          preDirection: 'N',
          preType: '',
          streetName: 'CARSON',
          suffixType: 'ST',
          suffixDirection: '',
          suffixQualifier: '',
          state: 'MT',
          zip: '59601',
          city: 'HELENA'
        }
      }
    ]
  }
};

const NON_VOTING_DISTRICT_OBJECT = {
  result: {
    input: {
      address: {
        street: '1025 5th St',
        zip: '20001'
      },
      benchmark: {
        id: '4',
        isDefault: false,
        benchmarkName: 'Public_AR_Current',
        benchmarkDescription: 'Public Address Ranges - Current Benchmark'
      },
      vintage: {
        id: '4',
        isDefault: true,
        vintageName: 'Current_Current',
        vintageDescription: 'Current Vintage - Current Benchmark'
      }
    },
    addressMatches: [
      {
        geographies: {
          '115th Congressional Districts': [
            {
              OID: 211904692355590,
              STATE: '11',
              FUNCSTAT: 'N',
              NAME: 'Delegate District (at Large)',
              AREAWATER: 18633403,
              CDSESSN: '115',
              LSADC: 'C4',
              CENTLON: '-077.0162745',
              BASENAME: 'Delegate District (at Large)',
              INTPTLAT: '+38.9041031',
              MTFCC: 'G5200',
              GEOID: '1198',
              CENTLAT: '+38.9047579',
              CD115: '98',
              INTPTLON: '-077.0172290',
              AREALAND: 158364994,
              OBJECTID: 264
            }
          ]
        },
        matchedAddress: '1025 5TH ST NW, WASHINGTON, DC, 20001',
        coordinates: {
          x: -77.01892,
          y: 38.903103
        },
        tigerLine: {
          side: 'R',
          tigerLineId: '638666952'
        },
        addressComponents: {
          fromAddress: '1001',
          toAddress: '1051',
          preQualifier: '',
          preDirection: '',
          preType: '',
          streetName: '5TH',
          suffixType: 'ST',
          suffixDirection: 'NW',
          suffixQualifier: '',
          state: 'DC',
          zip: '20001',
          city: 'WASHINGTON'
        }
      }
    ]
  }
};

const ZIP_ONLY_DISTRICT_OBJECT = {
  results: [
    {
      district: '12',
      link: 'http://pelosi.house.gov',
      name: 'Nancy Pelosi',
      office: '233 Cannon House Office Building',
      party: 'D',
      phone: '202-225-4965',
      state: 'CA'
    },
    {
      district: 'Junior Seat',
      link: 'http://www.boxer.senate.gov',
      name: 'Barbara Boxer',
      office: '112 Hart Senate Office Building',
      party: 'D',
      phone: '202-224-3553',
      state: 'CA'
    },
    {
      district: '',
      link: 'http://www.feinstein.senate.gov',
      name: 'Dianne Feinstein',
      office: '331 Hart Senate Office Building',
      party: 'D',
      phone: '202-224-3841',
      state: 'CA'
    }
  ]
};

const ZIP_ONLY_WITH_TWO_DISTRICTS_OBJECT = {
  results: [
    {
      district: '7',
      link: 'http://culberson.house.gov',
      name: 'John Culberson',
      office: '2372 Rayburn House Office Building',
      party: 'R',
      phone: '202-225-2571',
      state: 'TX'
    },
    {
      district: '9',
      link: 'http://algreen.house.gov',
      name: 'Al Green',
      office: '2347 Rayburn House Office Building',
      party: 'D',
      phone: '202-225-7508',
      state: 'TX'
    },
    {
      district: 'Senior Seat',
      link: 'http://www.cornyn.senate.gov',
      name: 'John Cornyn',
      office: '517 Hart Senate Office Building',
      party: 'R',
      phone: '202-224-2934',
      state: 'TX'
    },
    {
      district: '',
      link: 'http://www.cruz.senate.gov',
      name: 'Ted Cruz',
      office: '404 Russell Senate Office Building',
      party: 'R',
      phone: '202-224-5922',
      state: 'TX'
    }
  ]
};

const ZIP_ONLY_WITH_AT_LARGE_DISTRICT_OBJECT = {
  results: [
    {
      name: 'Steve Daines',
      party: 'R',
      state: 'MT',
      district: 'Junior Seat',
      phone: '202-224-2651',
      office: '320 Hart Senate Office Building',
      link: 'http://www.daines.senate.gov'
    },
    {
      name: 'Jon Tester',
      party: 'D',
      state: 'MT',
      district: 'Senior Seat',
      phone: '202-224-2644',
      office: '311 Hart Senate Office Building',
      link: 'http://www.tester.senate.gov'
    }
  ]
};

const DISTRICT = JSON.stringify(DISTRICT_OBJECT);
const AT_LARGE_DISTRICT = JSON.stringify(AT_LARGE_DISTRICT_OBJECT);
const NON_VOTING_DISTRICT = JSON.stringify(NON_VOTING_DISTRICT_OBJECT);
const ZIP_ONLY_DISTRICT = JSON.stringify(ZIP_ONLY_DISTRICT_OBJECT);
const ZIP_ONLY_WITH_TWO_DISTRICTS = JSON.stringify(ZIP_ONLY_WITH_TWO_DISTRICTS_OBJECT);
const ZIP_ONLY_WITH_AT_LARGE_DISTRICT = JSON.stringify(ZIP_ONLY_WITH_AT_LARGE_DISTRICT_OBJECT);

const DISTRICT_RESPONSE = {
  districts: [
    {
      state: 'CA',
      number: '12',
      id: 'CA-12'
    }
  ]
};

const TWO_DISTRICTS_RESPONSE = {
  districts: [
    {
      state: 'TX',
      number: '7',
      id: 'TX-7'
    },
    {
      state: 'TX',
      number: '9',
      id: 'TX-9'
    }
  ]
};

const AT_LARGE_DISTRICT_RESPONSE = {
  districts: [
    {
      state: 'MT',
      number: '0',
      id: 'MT-0'
    }
  ]
};

const NON_VOTING_DISTRICT_RESPONSE = {
  districts: [
    {
      state: 'DC',
      number: '0',
      id: 'DC-0'
    }
  ]
};

const CONGRESS_RESPONSE = {
  district: DISTRICT_RESPONSE,
  representatives: [
    {
      person: {
        firstname: 'Nancy',
        lastname: 'Pelosi'
      },
      title: 'Rep.',
      party: 'Democrat',
      phone: '202-225-4965',
      twitter: 'NancyPelosi',
      govtrack: '400314',
      cspan: '6153',
      next_election: '2018'
    }
  ],
  senators: [
    {
      person: {
        firstname: 'Dianne',
        lastname: 'Feinstein'
      },
      title: 'Sen.',
      party: 'Democrat',
      phone: '202-224-3841',
      twitter: 'SenFeinstein',
      govtrack: '300043',
      cspan: '13061',
      next_election: '2018'
    }, {
      person: {
        firstname: 'Kamala',
        lastname: 'Harris'
      },
      title: 'Sen.',
      party: 'Democrat',
      phone: '202-224-3553',
      twitter: 'SenKamalaHarris',
      govtrack: '412678',
      cspan: '1018696',
      next_election: '2022'
    }
  ]
};

const SINGLE_DIGIT_DISTRICT_CONGRESS_RESPONSE = {
  district: {
    districts: [
      {
        state: 'CA',
        number: '2',
        id: 'CA-2'
      }
    ]
  },
  representatives: [
    {
      person: {
        firstname: 'Jared',
        lastname: 'Huffman'
      },
      title: 'Rep.',
      party: 'Democrat',
      phone: '202-225-5161',
      twitter: 'RepHuffman',
      govtrack: '412511',
      cspan: '622431',
      next_election: '2018'
    }
  ],
  senators: [
    {
      person: {
        firstname: 'Dianne',
        lastname: 'Feinstein'
      },
      title: 'Sen.',
      party: 'Democrat',
      phone: '202-224-3841',
      twitter: 'SenFeinstein',
      govtrack: '300043',
      cspan: '13061',
      next_election: '2018'
    }, {
      person: {
        firstname: 'Kamala',
        lastname: 'Harris'
      },
      title: 'Sen.',
      party: 'Democrat',
      phone: '202-224-3553',
      twitter: 'SenKamalaHarris',
      govtrack: '412678',
      cspan: '1018696',
      next_election: '2022'
    }
  ]
};

const AT_LARGE_CONGRESS_RESPONSE = {
  district: {
    districts: [
      {
        state: 'AK',
        number: '0',
        id: 'AK-0'
      }
    ]
  },
  representatives: [
    {
      person: {
        firstname: 'Don',
        lastname: 'Young'
      },
      title: 'Rep.',
      party: 'Republican',
      phone: '202-225-5765',
      twitter: 'RepDonYoung',
      govtrack: '400440',
      cspan: '1897',
      next_election: '2018'
    }
  ],
  senators: [
  {
      person: {
        firstname: 'Lisa',
        lastname: 'Murkowski'
      },
      title: 'Sen.',
      party: 'Republican',
      phone: '202-224-6665',
      twitter: 'LisaMurkowski',
      govtrack: '300075',
      cspan: '1004138',
      next_election: '2022'
    }, {
      person: {
        firstname: 'Dan',
        lastname: 'Sullivan'
      },
      title: 'Sen.',
      party: 'Republican',
      phone: '202-224-3004',
      twitter: 'SenDanSullivan',
      govtrack: '412665',
      cspan: '1023262',
      next_election: '2020'
    }
  ]
};

const NON_VOTING_AT_LARGE_CONGRESS_RESPONSE = {
  district: {
    districts: [
      {
        state: 'PR',
        number: '0',
        id: 'PR-0'
      }
    ]
  },
  representatives: [
    {
      title: 'Rep.',
      person: {
        firstname: 'Jenniffer',
        lastname: 'González-Colón'
      },
      party: 'Republican',
      phone: '',
      twitter: 'repjenniffer',
      govtrack: '412723',
      cspan: '67353',
      next_election: '2018'
    }
  ],
  senators: []
};

module.exports = {
  SINGLE_DISTRICT_ZIP_CODE: 94102,
  TWO_DISTRICT_ZIP_CODE: 77035,
  NON_VOTING_ZIP_CODE: 20201,
  DISTRICT,
  AT_LARGE_DISTRICT,
  NON_VOTING_DISTRICT,
  ZIP_ONLY_DISTRICT,
  ZIP_ONLY_WITH_TWO_DISTRICTS,
  ZIP_ONLY_WITH_AT_LARGE_DISTRICT,
  DISTRICT_RESPONSE,
  TWO_DISTRICTS_RESPONSE,
  AT_LARGE_DISTRICT_RESPONSE,
  NON_VOTING_DISTRICT_RESPONSE,
  CONGRESS_RESPONSE,
  AT_LARGE_CONGRESS_RESPONSE,
  NON_VOTING_AT_LARGE_CONGRESS_RESPONSE,
  SINGLE_DIGIT_DISTRICT_CONGRESS_RESPONSE
};