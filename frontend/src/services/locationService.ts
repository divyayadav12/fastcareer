import api from './api';
import { STATES as FALLBACK_STATES, STATE_CITY_MAP as FALLBACK_STATE_CITY_MAP } from '../utils/constants';

// In-memory cache for fast, instant lookups
const citiesCache: Record<string, string[]> = { ...FALLBACK_STATE_CITY_MAP };
let statesCache: string[] = [...FALLBACK_STATES];
let hasFetchedAll = false;

/**
 * Fetch all available states from the API with fallback to local constants
 */
export const fetchStates = async (): Promise<string[]> => {
  try {
    const res = await api.get('/locations/states');
    if (res.data && Array.isArray(res.data.states) && res.data.states.length > 0) {
      statesCache = res.data.states;
      return statesCache;
    }
  } catch (error) {
    console.warn('Using fallback states list:', error);
  }
  return statesCache;
};

/**
 * Fetch cities for a specific state from the API (e.g. state = "Madhya Pradesh" or "MP")
 * Returns only the cities belonging to that state.
 */
export const fetchCitiesForState = async (state: string): Promise<string[]> => {
  if (!state || !state.trim()) return [];

  const trimmedState = state.trim();

  // If already in cache and non-empty, we can return it immediately or revalidate
  if (citiesCache[trimmedState] && citiesCache[trimmedState].length > 0) {
    // Optionally revalidate in background
    api.get(`/locations/cities?state=${encodeURIComponent(trimmedState)}`)
      .then(res => {
        if (res.data && Array.isArray(res.data.cities) && res.data.cities.length > 0) {
          citiesCache[trimmedState] = res.data.cities;
        }
      })
      .catch(() => {});
    return citiesCache[trimmedState];
  }

  try {
    const res = await api.get(`/locations/cities?state=${encodeURIComponent(trimmedState)}`);
    if (res.data && Array.isArray(res.data.cities)) {
      citiesCache[trimmedState] = res.data.cities;
      return res.data.cities;
    }
  } catch (error) {
    console.warn(`Failed to fetch cities from API for "${trimmedState}", checking fallback:`, error);
  }

  // Fallback to local map
  const fallback = FALLBACK_STATE_CITY_MAP[trimmedState] || [];
  citiesCache[trimmedState] = fallback;
  return fallback;
};

/**
 * Synchronous getter from cache for immediate render (never blocks UI)
 */
export const getCitiesForStateSync = (state: string): string[] => {
  if (!state || !state.trim()) return [];
  const trimmed = state.trim();
  return citiesCache[trimmed] || FALLBACK_STATE_CITY_MAP[trimmed] || [];
};

/**
 * Pre-fetch all locations in background if desired
 */
export const preloadLocations = async (): Promise<void> => {
  if (hasFetchedAll) return;
  try {
    const res = await api.get('/locations');
    if (res.data && res.data.stateCityMap) {
      Object.assign(citiesCache, res.data.stateCityMap);
      if (Array.isArray(res.data.states)) {
        statesCache = res.data.states;
      }
      hasFetchedAll = true;
    }
  } catch (err) {
    // Silently continue with fallback
  }
};
