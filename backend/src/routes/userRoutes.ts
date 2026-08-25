import express from 'express';
import { authUser, registerUser, getUserProfile } from '../controllers/userController';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/profile', getUserProfile);

export default router;
