"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const locationController_1 = require("../controllers/locationController");
const router = (0, express_1.Router)();
// GET /api/locations - All states and cities mapping
router.get('/', locationController_1.getAllLocations);
// GET /api/locations/states - All states list
router.get('/states', locationController_1.getStates);
// GET /api/locations/cities?state=Madhya Pradesh
router.get('/cities', locationController_1.getCitiesByState);
// GET /api/locations/cities/:state
router.get('/cities/:state', locationController_1.getCitiesByState);
exports.default = router;
