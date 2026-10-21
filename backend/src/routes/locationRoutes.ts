import { Router } from 'express';
import { getStates, getCitiesByState, getAllLocations } from '../controllers/locationController';

const router = Router();

// GET /api/locations - All states and cities mapping
router.get('/', getAllLocations);

// GET /api/locations/states - All states list
router.get('/states', getStates);

// GET /api/locations/cities?state=Madhya Pradesh
router.get('/cities', getCitiesByState);

// GET /api/locations/cities/:state
router.get('/cities/:state', getCitiesByState);

export default router;
