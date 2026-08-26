import express from 'express';
import { protect, employerOrAdmin } from '../middleware/authMiddleware';
import { submitFeedback, getFeedbacks } from '../controllers/feedbackController';
import { submitReferral, getReferrals } from '../controllers/referralController';
import { submitJobChange, getJobChangeRequests } from '../controllers/jobChangeController';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

// Feedback Routes
router.route('/feedback')
  .post(protect, submitFeedback)
  .get(protect, employerOrAdmin, getFeedbacks);

// Referral Routes
router.route('/referrals')
  .post(protect, upload.single('resume'), submitReferral)
  .get(protect, employerOrAdmin, getReferrals);

// Job Change Routes
router.route('/job-change')
  .post(protect, submitJobChange)
  .get(protect, employerOrAdmin, getJobChangeRequests);

export default router;
