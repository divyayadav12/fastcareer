import express from 'express';
import { 
  getJobs, 
  getJobById, 
  createJob, 
  getJobMatchScore, 
  getEmployerJobs,
  deleteJob,
  cleanupTestJobs
} from '../controllers/jobController';
import { protect, employerOrAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/cleanup-test-jobs').post(protect, employerOrAdmin, cleanupTestJobs);
router.route('/').get(getJobs).post(protect, employerOrAdmin, createJob);
router.route('/employer').get(protect, employerOrAdmin, getEmployerJobs);
router.route('/:id').get(getJobById).delete(protect, employerOrAdmin, deleteJob);
router.route('/:id/match/:userId').get(protect, getJobMatchScore);

export default router;

