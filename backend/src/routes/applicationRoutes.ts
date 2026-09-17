import express from 'express';
import { applyForJob, getJobApplications, updateApplicationStatus, getEmployerApplications,
  getAllApplications,
  getCandidateApplications } from '../controllers/applicationController';
import { upload } from '../utils/upload';
import { protect, admin, employerOrAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/:jobId', protect, upload.single('resume'), applyForJob);
router.get('/job/:jobId', protect, employerOrAdmin, getJobApplications);
router.get('/employer', protect, employerOrAdmin, getEmployerApplications);
router.get('/candidate/:id', protect, getCandidateApplications);
router.get('/', protect, admin, getAllApplications);
router.put('/:id/status', protect, employerOrAdmin, updateApplicationStatus);

export default router;
