"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLocations = exports.getCitiesByState = exports.getStates = void 0;
const locationHelper_1 = require("../utils/locationHelper");
// Common aliases and abbreviations for Indian states
const STATE_ALIASES = {
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
const getStates = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const states = [...locationHelper_1.STATES].sort();
        return res.status(200).json({
            success: true,
            count: states.length,
            states
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch states',
            error: error.message
        });
    }
});
exports.getStates = getStates;
/**
 * GET /api/locations/cities?state=Madhya Pradesh
 * or GET /api/locations/cities/:state
 * Returns cities for a given state (e.g. if state is MP/Madhya Pradesh, only MP cities)
 */
const getCitiesByState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            locationHelper_1.STATES.find(s => s.toLowerCase() === lower) ||
            rawState;
        const cities = locationHelper_1.STATE_CITY_MAP[resolvedStateName] || [];
        if (!cities.length) {
            // Secondary fallback check for partial/case-insensitive match in STATE_CITY_MAP keys
            const key = Object.keys(locationHelper_1.STATE_CITY_MAP).find(k => k.toLowerCase() === lower);
            if (key && locationHelper_1.STATE_CITY_MAP[key]) {
                return res.status(200).json({
                    success: true,
                    state: key,
                    count: locationHelper_1.STATE_CITY_MAP[key].length,
                    cities: locationHelper_1.STATE_CITY_MAP[key]
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch cities for state',
            error: error.message
        });
    }
});
exports.getCitiesByState = getCitiesByState;
/**
 * GET /api/locations
 * Returns full state-to-cities dictionary and states list
 */
const getAllLocations = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const states = [...locationHelper_1.STATES].sort();
        return res.status(200).json({
            success: true,
            states,
            stateCityMap: locationHelper_1.STATE_CITY_MAP
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch location data',
            error: error.message
        });
    }
});
exports.getAllLocations = getAllLocations;
