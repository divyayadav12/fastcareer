import { STATE_CITY_MAP } from './indianCitiesData';

export { STATE_CITY_MAP };
export const STATES = Object.keys(STATE_CITY_MAP);
export const ALL_CITIES = Array.from(new Set(Object.values(STATE_CITY_MAP).flat())).sort();

export const isValidCity = (city: string) => {
    if (!city || typeof city !== 'string') return false;
    const trimmed = city.trim();
    return trimmed.length > 0;
};
export const isValidState = (state: string) => STATES.includes(state);
export const isValidCityForState = (city: string, state: string) => {
    if (!STATE_CITY_MAP[state]) return false;
    return STATE_CITY_MAP[state].includes(city);
};
