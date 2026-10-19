import express from 'express';
import {
  submitIndustrialTraining,
  sendVerificationOTP,
  verifyOTP,
  getIndustrialTrainingApplications,
  exportIndustrialTrainingExcel,
  deleteIndustrialTrainingApplication
} from '../controllers/industrialTrainingController';

const router = express.Router();

// Public routes for candidate registration & verification
router.post('/', submitIndustrialTraining);
router.post('/send-otp', sendVerificationOTP);
router.post('/verify-otp', verifyOTP);

// Admin queries and exports
router.get('/', getIndustrialTrainingApplications);
router.get('/export', exportIndustrialTrainingExcel);
router.delete('/:id', deleteIndustrialTrainingApplication);

export default router;
