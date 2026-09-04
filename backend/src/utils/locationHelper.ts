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

// Explicit Business Mappings
if (STATE_CITY_MAP['Punjab']) {
  STATE_CITY_MAP['Punjab'] = [...new Set([...STATE_CITY_MAP['Punjab'], 'Chandigarh'])].sort();
}
if (STATE_CITY_MAP['Haryana']) {
  STATE_CITY_MAP['Haryana'] = [...new Set([...STATE_CITY_MAP['Haryana'], 'Chandigarh'])].sort();
}

export const STATES = Object.keys(STATE_CITY_MAP);
export const ALL_CITIES = Array.from(new Set(Object.values(STATE_CITY_MAP).flat())).sort();

export const isValidCity = (city: string) => ALL_CITIES.includes(city);
export const isValidState = (state: string) => STATES.includes(state);
export const isValidCityForState = (city: string, state: string) => {
    if (!STATE_CITY_MAP[state]) return false;
    return STATE_CITY_MAP[state].includes(city);
};
