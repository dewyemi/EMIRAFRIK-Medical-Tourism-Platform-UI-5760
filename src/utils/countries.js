// Comprehensive list of countries served by EMIRAFRIK
export const COUNTRIES = {
  // Middle East Countries
  MIDDLE_EAST: [
    'United Arab Emirates',
    'Saudi Arabia',
    'Qatar',
    'Kuwait',
    'Bahrain',
    'Oman'
  ],
  
  // French-Speaking African Countries
  FRENCH_AFRICA: [
    'Algeria',
    'Benin',
    'Burkina Faso',
    'Burundi',
    'Cameroon',
    'Central African Republic',
    'Chad',
    'Comoros',
    'Democratic Republic of the Congo',
    'Republic of the Congo',
    'Djibouti',
    'Gabon',
    'Guinea',
    'Ivory Coast (Côte d\'Ivoire)',
    'Madagascar',
    'Mali',
    'Mauritania',
    'Mauritius',
    'Morocco',
    'Niger',
    'Rwanda',
    'Senegal',
    'Seychelles',
    'Togo',
    'Tunisia'
  ],

  // Other African Countries (for reference)
  OTHER_AFRICA: [
    'Angola',
    'Botswana',
    'Cape Verde',
    'Eritrea',
    'Ethiopia',
    'Gambia',
    'Ghana',
    'Kenya',
    'Lesotho',
    'Liberia',
    'Libya',
    'Malawi',
    'Mozambique',
    'Namibia',
    'Nigeria',
    'Sierra Leone',
    'Somalia',
    'South Africa',
    'South Sudan',
    'Sudan',
    'Swaziland',
    'Tanzania',
    'Uganda',
    'Zambia',
    'Zimbabwe'
  ]
};

// All countries served by EMIRAFRIK (Middle East + French-speaking Africa)
export const SERVED_COUNTRIES = [
  ...COUNTRIES.MIDDLE_EAST,
  ...COUNTRIES.FRENCH_AFRICA
].sort();

// All countries for general selection
export const ALL_COUNTRIES = [
  ...COUNTRIES.MIDDLE_EAST,
  ...COUNTRIES.FRENCH_AFRICA,
  ...COUNTRIES.OTHER_AFRICA
].sort();

// Country groups for filtering
export const COUNTRY_GROUPS = [
  {
    label: 'Middle East',
    countries: COUNTRIES.MIDDLE_EAST
  },
  {
    label: 'French-Speaking Africa',
    countries: COUNTRIES.FRENCH_AFRICA
  },
  {
    label: 'Other African Countries',
    countries: COUNTRIES.OTHER_AFRICA
  }
];

// Check if country is served by EMIRAFRIK
export const isServedCountry = (country) => {
  return SERVED_COUNTRIES.includes(country);
};

// Get country group
export const getCountryGroup = (country) => {
  if (COUNTRIES.MIDDLE_EAST.includes(country)) return 'Middle East';
  if (COUNTRIES.FRENCH_AFRICA.includes(country)) return 'French-Speaking Africa';
  if (COUNTRIES.OTHER_AFRICA.includes(country)) return 'Other African Countries';
  return 'Other';
};