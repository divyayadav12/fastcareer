import { Request, Response } from 'express';
import { STATE_CITY_MAP, STATES } from '../utils/locationHelper';

// Common aliases and abbreviations for Indian states
const STATE_ALIASES: Record<string, string> = {
  'mp': 'Madhya Pradesh',
  'madhya pradesh': 'Madhya Pradesh',
  'up': 'Uttar Pradesh',
  'uttar pradesh': 'Uttar Pradesh',
  'ap': 'Andhra Pradesh',
  'andhra pradesh': 'Andhra Pradesh',
  'mh': 'Maharashtra',
  'maharashtra': 'Maharashtra',
  'dl': 'Delhi',
  'delhi': 'Delhi',
  'rj': 'Rajasthan',
  'rajasthan': 'Rajasthan',
  'gj': 'Gujarat',
  'gujarat': 'Gujarat',
  'ka': 'Karnataka',
  'karnataka': 'Karnataka',
  'tn': 'Tamil Nadu',
  'tamil nadu': 'Tamil Nadu',
  'wb': 'West Bengal',
  'west bengal': 'West Bengal',
  'pb': 'Punjab',
  'punjab': 'Punjab',
  'hr': 'Haryana',
  'haryana': 'Haryana',
  'kl': 'Kerala',
  'kerala': 'Kerala',
  'br': 'Bihar',
  'bihar': 'Bihar',
  'jh': 'Jharkhand',
  'jharkhand': 'Jharkhand',
  'od': 'Odisha',
  'odisha': 'Odisha',
  'cg': 'Chhattisgarh',
  'chhattisgarh': 'Chhattisgarh',
  'uk': 'Uttarakhand',
  'uttarakhand': 'Uttarakhand',
  'as': 'Assam',
  'assam': 'Assam',
  'hp': 'Himachal Pradesh',
  'himachal pradesh': 'Himachal Pradesh',
  'ga': 'Goa',
  'goa': 'Goa',
  'jk': 'Jammu and Kashmir',
  'jammu and kashmir': 'Jammu and Kashmir',
  'ch': 'Chandigarh',
  'chandigarh': 'Chandigarh',
  'ts': 'Telangana',
  'telangana': 'Telangana'
};

/**
 * GET /api/locations/states
 * Returns all available states
 */
export const getStates = async (_req: Request, res: Response) => {
  try {
    const states = [...STATES].sort();
    return res.status(200).json({
      success: true,
      count: states.length,
      states
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch states',
      error: error.message
    });
  }
};

/**
 * GET /api/locations/cities?state=Madhya Pradesh
 * or GET /api/locations/cities/:state
 * Returns cities for a given state (e.g. if state is MP/Madhya Pradesh, only MP cities)
 */
export const getCitiesByState = async (req: Request, res: Response) => {
  try {
    const paramState = Array.isArray(req.params.state) ? req.params.state[0] : req.params.state;
    const queryState = Array.isArray(req.query.state) ? req.query.state[0] : req.query.state;
    const rawState = String(paramState || queryState || '').trim();
    if (!rawState) {
      return res.status(400).json({
        success: false,
        message: 'State query or parameter is required. Example: /api/locations/cities?state=Madhya Pradesh'
      });
    }

    const lower = rawState.toLowerCase();
    const resolvedStateName = STATE_ALIASES[lower] ||
      STATES.find(s => s.toLowerCase() === lower) ||
      rawState;

    const cities = STATE_CITY_MAP[resolvedStateName] || [];

    if (!cities.length) {
      // Secondary fallback check for partial/case-insensitive match in STATE_CITY_MAP keys
      const key = Object.keys(STATE_CITY_MAP).find(k => k.toLowerCase() === lower);
      if (key && STATE_CITY_MAP[key]) {
        return res.status(200).json({
          success: true,
          state: key,
          count: STATE_CITY_MAP[key].length,
          cities: STATE_CITY_MAP[key]
        });
      }

      return res.status(404).json({
        success: false,
        message: `No cities found for state: ${rawState}`,
        cities: []
      });
    }

    return res.status(200).json({
      success: true,
      state: resolvedStateName,
      count: cities.length,
      cities
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch cities for state',
      error: error.message
    });
  }
};

/**
 * GET /api/locations
 * Returns full state-to-cities dictionary and states list
 */
export const getAllLocations = async (_req: Request, res: Response) => {
  try {
    const states = [...STATES].sort();
    return res.status(200).json({
      success: true,
      states,
      stateCityMap: STATE_CITY_MAP
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch location data',
      error: error.message
    });
  }
};
