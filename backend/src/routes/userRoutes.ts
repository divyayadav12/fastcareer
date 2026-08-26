import express from 'express';
import { authUser, registerUser, getUserProfile, updateUserProfile, getCandidates } from '../controllers/userController';
import { protect, admin, employerOrAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/candidates').get(protect, employerOrAdmin, getCandidates);

export default router;
