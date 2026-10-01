import express from 'express';
import { 
  authUser, 
  registerUser, 
  getUserProfile, 
  updateUserProfile, 
  getCandidates,
  assignCandidatesToCompany,
  getEmployers,
  createEmployee,
  getEmployees,
  deleteEmployee,
  matchCandidatesFromExcel,
  downloadCandidateResumesZip,
  seedLiveCandidates, seed50Candidates, cleanupDbAndFixResumes, seed10CandidatesController,
  getCandidateResume
} from '../controllers/userController';
import { protect, admin, employerOrAdmin } from '../middleware/authMiddleware';
import excelUpload from '../middleware/excelUploadMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.route('/').post(registerUser);
router.post('/login', authUser);
router.post('/upload-resume', upload.single('resume'), (req, res) => {
  if (req.file) {
    const url = req.file.path.startsWith('http') 
      ? req.file.path 
      : `/${req.file.path.replace(/\\/g, '/')}`;
    res.json({ url, resumeUrl: url });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/candidates').get(protect, employerOrAdmin, getCandidates);
router.put('/candidates/assign-company', protect, admin, assignCandidatesToCompany);
router.route('/employers').get(protect, employerOrAdmin, getEmployers);
router.route('/employees')
  .post(protect, admin, createEmployee)
  .get(protect, admin, getEmployees);
router.route('/employees/:id')
  .delete(protect, admin, deleteEmployee);
router.get('/candidates/:id/resume', getCandidateResume);
router.get('/resume/:id', getCandidateResume);
router.post('/candidates/match-excel', protect, employerOrAdmin, excelUpload.single('file'), matchCandidatesFromExcel);
router.post('/candidates/download-resumes-zip', protect, employerOrAdmin, downloadCandidateResumesZip);
router.get('/seed-10-candidates', seed10CandidatesController);
router.get('/seed-test-candidates', seedLiveCandidates);
router.get('/seed-50-candidates', seed50Candidates);
router.post('/cleanup-db', protect, admin, cleanupDbAndFixResumes);
router.post('/seed-test-candidates', seedLiveCandidates);

export default router;
