import { State, City } from 'country-state-city';

const indianStates = State.getStatesOfCountry('IN');
export const STATE_CITY_MAP: Record<string, string[]> = {};

indianStates.forEach(state => {
  const cities = City.getCitiesOfState('IN', state.isoCode);
  STATE_CITY_MAP[state.name] = cities.map(c => c.name);
  if (!STATE_CITY_MAP[state.name].includes('Other')) {
    STATE_CITY_MAP[state.name].push('Other');
  }
});

export const STATES = Object.keys(STATE_CITY_MAP);
export const ALL_CITIES = Array.from(new Set(Object.values(STATE_CITY_MAP).flat())).sort();
export const YEARS = Array.from({length: 30}, (_, i) => String(new Date().getFullYear() - i));
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const BOARDS = ['CBSE', 'ICSE', 'State Board'];
export const ATTEMPT_YEARS = ['Sept\'25', 'Jan\'26', 'May\'25', 'Nov\'24', 'May\'24', 'Nov\'23', 'May\'23', 'Nov\'22', 'May\'22', 'Nov\'21', 'May\'21', 'Nov\'20', 'May\'20'];
export const ATTEMPTS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];
export const CA_EXAM_MONTHS = ['Jan', 'May', 'Sep', 'Nov'];
export const NATURE_OF_WORK = [
  'Statutory Audit',
  'Internal Audit',
  'Direct Tax',
  'Indirect Tax',
  'Corporate Finance',
  'Transfer Pricing',
  'Mergers & Acquisitions',
  'IT Audit',
  'Forensic Audit',
  'Other'
];

export const COLLEGES = ['ICAI', 'Delhi University', 'Mumbai University', 'Pune University', 'IGNOU'];
export const PREFERRED_CAMPUS_CITIES = ['Mumbai', 'Kolkata', 'Delhi', 'South india'];
export const ARTICLESHIP_TYPES = ['Articleship', 'I.T. Training'];

export const CA_FIRMS = [
  'If Not Exists In Given List',
  'A. BAFNA & COMPANY',
  'AIYAR & CO',
  'ANEJA ASSOCIATES',
  'B S R & COMPANY/ KPMG',
  'BANSI S. MEHTA & CO.',
  'BATLIBOI & PUROHIT',
  'BDO - MZSK & ASSOCIATES',
  'BHUTA SHAH & CO',
  'BORKAR & MUZUMDAR',
  'BRAHMYA & CO.',
  'C C CHOKSI & CO. / A.F FERGUSON & CO./ DELOITTE HASKINS & SELLS',
  'C C CHOKSI & CO. LLP',
  'CHATURVEDI & SHAH',
  'CONTRACTOR NAYAK & KISHNADWALA',
  'D B DESAI & ASSOCIATES',
  'DALAL & SHAH',
  'DELOITTE HASKINS & SELLS',
  'ERNST & YOUNG/ SR BATLIBOI & CO.',
  'FORD-RHODES-PARKS & CO',
  'G.M. KAPADIA & CO.',
  'G.P. KAPADIA & CO.',
  'GSA & ASSOCIATES',
  'HARIBHAKTI & CO./ BDO INTERNATIONAL',
  'J.C. BHALLA & CO.',
  'K S AIYAR & CO.',
  'K.G. SOMANI & CO.',
  'KALANI & COMPANY',
  'KALYANIWALLA & MISTRY',
  'KHANDELWAL JAIN & CO.',
  'KHANNA & ANNANDAM',
  'KHIMJI KUNVERJI & CO',
  'KIRTANE AND PANDIT',
  'LB JHA & CO.',
  'LODHA & CO.',
  'LOVELOCK & LEWES/ PRICE WATERHOUSE COOPERS (PWC)',
  'LUTHRA & LUTHRA',
  'M G BHANDARI',
  'M M NISSIM',
  'M.P.CHITALE & CO.',
  'M/S SHARMA GOEL & CO.',
  'MAHAJAN & AIBARA',
  'MALPANI & CO.',
  'MEHRA GOEL & CO.',
  'N A SHAH & CO.',
  'N.C.RAJAGOPAL & CO.',
  'N.M.RAIJI & CO.',
  'P.R.MEHRA & CO.',
  'R BHUPATHY & CO.',
  'R G N PRICE & CO.',
  'RAY AND RAY',
  'RSM & CO.',
  'S R BATLIBOI & CO.',
  'S. BHANDARI & CO.',
  'S. R. DINODIA & COMPANY',
  'S. R. GOYAL & CO.',
  'S. RAMANAND AIYAR & CO.',
  'S.C VASUDEVA & CO.',
  'S.N.DHAWAN & CO./ MAZARS',
  'S.P NAGRATH & CO.',
  'S.R. BATLIBOI & COMPANY/ ERNST & YOUNG (E&Y)',
  'SAHNI NATARAJAN & BEHL/ SNB',
  'SHARP & TANNAN',
  'SINGHI & CO.',
  'SRIDHAR & SANTHANAM/ PKF SHRISHAR SANTHANAM',
  'SS KOTHARI MEHTA & CO./ SSKM',
  'SUDIT K. PAREKH & CO',
  'SURESH SURANA & ASSOCIATES',
  'T.R. CHADDHA & CO.',
  'THAKUR VAIDYANATH AIYAR & CO.',
  'UBEROI SOOD & KAPOOR',
  'V. SANKAR AIYAR & CO.',
  'V.K.DHINGRA & CO.',
  'VED JAIN & ASSOCIATES',
  'VERMA&VERMA ASSOCIATES',
  'WALKER CHANDIOK & COMPANY/ GRANT THORNTON (GT)',
  'Other'
];
