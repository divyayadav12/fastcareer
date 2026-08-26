import express from 'express';
import { createSharedJob, getSharedJobs } from '../controllers/sharedJobController';
import { protect, employerOrAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Allow public submission or we can add protect if it must be a logged in user.
// Based on typical candidate dashboards, they are logged in.
router.route('/').post(protect, createSharedJob).get(protect, employerOrAdmin, getSharedJobs);

export default router;
