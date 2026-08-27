import express from 'express';
import { applyForJob, getJobApplications, updateApplicationStatus, getEmployerApplications } from '../controllers/applicationController';
import { upload } from '../utils/upload';
import { protect, employerOrAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/:jobId', protect, upload.single('resume'), applyForJob);
router.get('/job/:jobId', protect, employerOrAdmin, getJobApplications);
router.get('/employer', protect, employerOrAdmin, getEmployerApplications);
router.put('/:id/status', protect, employerOrAdmin, updateApplicationStatus);

export default router;
