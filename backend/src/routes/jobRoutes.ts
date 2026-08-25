import express from 'express';
import { getJobs, getJobById, createJob, getJobMatchScore } from '../controllers/jobController';

const router = express.Router();

router.route('/').get(getJobs).post(createJob);
router.route('/:id').get(getJobById);
router.route('/:id/match/:userId').get(getJobMatchScore);

export default router;
