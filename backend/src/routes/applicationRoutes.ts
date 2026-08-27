import express from 'express';
import { applyForJob, getJobApplications, updateApplicationStatus, getEmployerApplications } from '../controllers/applicationController';
import { upload } from '../utils/upload';
import { protect, employer } from '../middleware/auth';

const router = express.Router();

router.post('/:jobId', protect, upload.single('resume'), applyForJob);
router.get('/job/:jobId', protect, employer, getJobApplications);
router.get('/employer', protect, employer, getEmployerApplications);
router.put('/:id/status', protect, employer, updateApplicationStatus);

export default router;
