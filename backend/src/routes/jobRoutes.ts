import express from 'express';
import { getJobs, getJobById, createJob, getJobMatchScore, getEmployerJobs } from '../controllers/jobController';
import { protect, employerOrAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(getJobs).post(protect, employerOrAdmin, createJob);
router.route('/employer').get(protect, employerOrAdmin, getEmployerJobs);
router.route('/:id').get(getJobById);
router.route('/:id/match/:userId').get(protect, getJobMatchScore);

export default router;
