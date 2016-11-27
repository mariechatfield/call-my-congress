const DISTRICT_OBJECT = {
  result: {
    addressMatches: [
      {
        addressComponents: {
          city: 'SAN FRANCISCO',
          fromAddress: '158',
          preDirection: '',
          preQualifier: '',
          preType: '',
          state: 'CA',
          streetName: 'DUBOCE',
          suffixDirection: '',
          suffixQualifier: '',
          suffixType: 'AVE',
          toAddress: '198',
          zip: '94103'
        },
        coordinates: {
          x: -122.42422,
          y: 37.769764
        },
        geographies: {
          '115th Congressional Districts': [
            {
              AREALAND: 101086658,
              AREAWATER: 211581419,
              BASENAME: '12',
              CD115: '12',
              CDSESSN: '115',
              CENTLAT: '+37.7853375',
              CENTLON: '-122.4347034',
              FUNCSTAT: 'N',
              GEOID: '0612',
              INTPTLAT: '+37.7855141',
              INTPTLON: '-122.4340005',
              LSADC: 'C2',
              MTFCC: 'G5200',
              NAME: 'Congressional District 12',
              OBJECTID: 309,
              OID: 211904492478597,
              STATE: '06',
              'STGEOMETRY.AREA': 5.0144496E+8,
              'STGEOMETRY.LEN': 132664.16
            }
          ]
        },
        matchedAddress: '180 DUBOCE AVE, SAN FRANCISCO, CA, 94103',
        tigerLine: {
          side: 'R',
          tigerLineId: '192284146'
        }
      }
    ],
    input: {
      address: {
        street: '180 Duboce Ave',
        zip: '94103'
      },
      benchmark: {
        benchmarkDescription: 'Public Address Ranges - Current Benchmark',
        benchmarkName: 'Public_AR_Current',
        id: '4',
        isDefault: false
      },
      vintage: {
        id: '4',
        isDefault: true,
        vintageDescription: 'Current Vintage - Current Benchmark',
        vintageName: 'Current_Current'
      }
    }
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
      district: 'Senior Seat',
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
      district: 'Junior Seat',
      link: 'http://www.cruz.senate.gov',
      name: 'Ted Cruz',
      office: '404 Russell Senate Office Building',
      party: 'R',
      phone: '202-224-5922',
      state: 'TX'
    }
  ]
};

const SENATORS_OBJECT = {
 meta: {
  limit: 100,
  offset: 0,
  total_count: 2
 },
 objects: [
  {
   caucus: null,
   congress_numbers: [
    112,
    113,
    114
   ],
   current: true,
   description: 'Junior Senator from California',
   district: null,
   enddate: '2017-01-03',
   extra: {
    address: '112 Hart Senate Office Building Washington DC 20510',
    contact_form: 'https://www.boxer.senate.gov/contact/shareyourviews.html',
    fax: '202-224-0454',
    office: '112 Hart Senate Office Building'
   },
   id: 3853,
   leadership_title: null,
   party: 'Democrat',
   person: {
    bioguideid: 'B000711',
    birthday: '1940-11-11',
    cspanid: 2470,
    firstname: 'Barbara',
    gender: 'female',
    gender_label: 'Female',
    id: 300011,
    lastname: 'Boxer',
    link: 'https://www.govtrack.us/congress/members/barbara_boxer/300011',
    middlename: '',
    name: 'Sen. Barbara Boxer [D-CA]',
    namemod: '',
    nickname: '',
    osid: 'N00006692',
    pvsid: '53274',
    sortname: 'Boxer, Barbara (Sen.) [D-CA]',
    twitterid: 'SenatorBoxer',
    youtubeid: 'SenatorBoxer'
   },
   phone: '202-224-3553',
   role_type: 'senator',
   role_type_label: 'Senator',
   senator_class: 'class3',
   senator_class_label: 'Class 3',
   senator_rank: 'junior',
   senator_rank_label: 'Junior',
   startdate: '2011-01-05',
   state: 'CA',
   title: 'Sen.',
   title_long: 'Senator',
   website: 'https://www.boxer.senate.gov'
  },
  {
   caucus: null,
   congress_numbers: [
    113,
    114,
    115
   ],
   current: true,
   description: 'Senior Senator from California',
   district: null,
   enddate: '2019-01-03',
   extra: {
    address: '331 Hart Senate Office Building Washington DC 20510',
    contact_form: 'https://www.feinstein.senate.gov/public/index.cfm/e-mail-me',
    fax: '202-228-3954',
    office: '331 Hart Senate Office Building',
    rss_url: 'http://www.feinstein.senate.gov/public/?a=rss.feed'
   },
   id: 42868,
   leadership_title: null,
   party: 'Democrat',
   person: {
    bioguideid: 'F000062',
    birthday: '1933-06-22',
    cspanid: 13061,
    firstname: 'Dianne',
    gender: 'female',
    gender_label: 'Female',
    id: 300043,
    lastname: 'Feinstein',
    link: 'https://www.govtrack.us/congress/members/dianne_feinstein/300043',
    middlename: '',
    name: 'Sen. Dianne Feinstein [D-CA]',
    namemod: '',
    nickname: '',
    osid: 'N00007364',
    pvsid: '53273',
    sortname: 'Feinstein, Dianne (Sen.) [D-CA]',
    twitterid: 'SenFeinstein',
    youtubeid: 'SenatorFeinstein'
   },
   phone: '202-224-3841',
   role_type: 'senator',
   role_type_label: 'Senator',
   senator_class: 'class1',
   senator_class_label: 'Class 1',
   senator_rank: 'senior',
   senator_rank_label: 'Senior',
   startdate: '2013-01-03',
   state: 'CA',
   title: 'Sen.',
   title_long: 'Senator',
   website: 'http://www.feinstein.senate.gov'
  }
 ]
};

const REPRESENTATIVE_OBJECT = {
 meta: {
  limit: 100,
  offset: 0,
  total_count: 1
 },
 objects: [
  {
   caucus: null,
   congress_numbers: [
    114
   ],
   current: true,
   description: `Representative for California's 12th congressional district`,
   district: 12,
   enddate: '2017-01-03',
   extra: {
    address: '233 Cannon HOB; Washington DC 20515-0512',
    contact_form: 'http://pelosi.house.gov/contact-me/email-me',
    fax: '202-225-8259',
    office: '233 Cannon House Office Building',
    rss_url: 'http://pelosi.house.gov/atom.xml'
   },
   id: 43364,
   leadership_title: 'Minority Leader',
   party: 'Democrat',
   person: {
    bioguideid: 'P000197',
    birthday: '1940-03-26',
    cspanid: 6153,
    firstname: 'Nancy',
    gender: 'female',
    gender_label: 'Female',
    id: 400314,
    lastname: 'Pelosi',
    link: 'https://www.govtrack.us/congress/members/nancy_pelosi/400314',
    middlename: '',
    name: 'Rep. Nancy Pelosi [D-CA12]',
    namemod: '',
    nickname: '',
    osid: 'N00007360',
    pvsid: '26732',
    sortname: 'Pelosi, Nancy (Rep.) [D-CA12]',
    twitterid: 'NancyPelosi',
    youtubeid: 'nancypelosi'
   },
   phone: '202-225-4965',
   role_type: 'representative',
   role_type_label: 'Representative',
   senator_class: null,
   senator_rank: null,
   startdate: '2015-01-06',
   state: 'CA',
   title: 'Rep.',
   title_long: 'Representative',
   website: 'http://pelosi.house.gov'
  }
 ]
};

const DISTRICT = JSON.stringify(DISTRICT_OBJECT);
const ZIP_ONLY_DISTRICT = JSON.stringify(ZIP_ONLY_DISTRICT_OBJECT);
const ZIP_ONLY_WITH_TWO_DISTRICTS = JSON.stringify(ZIP_ONLY_WITH_TWO_DISTRICTS_OBJECT);
const SENATORS = JSON.stringify(SENATORS_OBJECT);
const REPRESENTATIVE = JSON.stringify(REPRESENTATIVE_OBJECT);

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

const CONGRESS_RESPONSE = {
  district: DISTRICT_RESPONSE,
  representatives: REPRESENTATIVE_OBJECT.objects,
  senators: SENATORS_OBJECT.objects
};

module.exports = {
  DISTRICT,
  ZIP_ONLY_DISTRICT,
  ZIP_ONLY_WITH_TWO_DISTRICTS,
  SENATORS,
  REPRESENTATIVE,
  DISTRICT_RESPONSE,
  TWO_DISTRICTS_RESPONSE,
  CONGRESS_RESPONSE
};