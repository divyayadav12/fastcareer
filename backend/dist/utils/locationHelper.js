"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidCityForState = exports.isValidState = exports.isValidCity = exports.ALL_CITIES = exports.STATES = exports.STATE_CITY_MAP = void 0;
const indianCitiesData_1 = require("./indianCitiesData");
Object.defineProperty(exports, "STATE_CITY_MAP", { enumerable: true, get: function () { return indianCitiesData_1.STATE_CITY_MAP; } });
exports.STATES = Object.keys(indianCitiesData_1.STATE_CITY_MAP);
exports.ALL_CITIES = Array.from(new Set(Object.values(indianCitiesData_1.STATE_CITY_MAP).flat())).sort();
const isValidCity = (city) => {
    if (!city || typeof city !== 'string')
        return false;
    const trimmed = city.trim();
    return trimmed.length > 0;
};
exports.isValidCity = isValidCity;
const isValidState = (state) => exports.STATES.includes(state);
exports.isValidState = isValidState;
const isValidCityForState = (city, state) => {
    if (!indianCitiesData_1.STATE_CITY_MAP[state])
        return false;
    return indianCitiesData_1.STATE_CITY_MAP[state].includes(city);
};
exports.isValidCityForState = isValidCityForState;
