import express from 'express';
import {
  uploadAudio,
  submitAssessment,
  getMyAssessment,
  getAllAssessments,
  reviewAssessment
} from '../controllers/assessmentController';
import { protect, admin, employerOrAdmin } from '../middleware/authMiddleware';
import audioUpload from '../middleware/audioUploadMiddleware';

const router = express.Router();

// Candidate endpoints
router.post('/upload-audio', protect, audioUpload.single('audio'), uploadAudio);
router.post('/submit', protect, submitAssessment);
router.get('/my', protect, getMyAssessment);

// Admin / Employer endpoints
router.get('/', protect, employerOrAdmin, getAllAssessments);
router.put('/:id/review', protect, employerOrAdmin, reviewAssessment);

export default router;
