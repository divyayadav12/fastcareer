import express from 'express';
import { 
  applyForJob, 
  getJobApplications, 
  updateApplicationStatus, 
  getEmployerApplications,
  getAllApplications,
  getCandidateApplications,
  deleteApplication
} from '../controllers/applicationController';
import { upload } from '../utils/upload';
import { protect, admin, employerOrAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/my', protect, getCandidateApplications);
router.get('/candidate', protect, getCandidateApplications);
router.get('/candidate/:id', protect, getCandidateApplications);
router.post('/:jobId', protect, upload.single('resume'), applyForJob);
router.get('/job/:jobId', protect, employerOrAdmin, getJobApplications);
router.get('/employer', protect, employerOrAdmin, getEmployerApplications);
router.get('/', protect, employerOrAdmin, getAllApplications);
router.route('/:id').delete(protect, employerOrAdmin, deleteApplication);
router.put('/:id/status', protect, employerOrAdmin, updateApplicationStatus);

export default router;

