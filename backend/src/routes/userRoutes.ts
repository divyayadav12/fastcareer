import express from 'express';
import { 
  authUser, 
  registerUser, 
  getUserProfile, 
  updateUserProfile, 
  getCandidates,
  matchCandidatesFromExcel,
  downloadCandidateResumesZip
} from '../controllers/userController';
import { protect, admin, employerOrAdmin } from '../middleware/authMiddleware';
import excelUpload from '../middleware/excelUploadMiddleware';

const router = express.Router();

router.route('/').post(registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/candidates').get(protect, employerOrAdmin, getCandidates);
router.post('/candidates/match-excel', protect, employerOrAdmin, excelUpload.single('file'), matchCandidatesFromExcel);
router.post('/candidates/download-resumes-zip', protect, employerOrAdmin, downloadCandidateResumesZip);

export default router;
