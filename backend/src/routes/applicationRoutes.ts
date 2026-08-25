import express from 'express';
import { applyForJob, getJobApplications, updateApplicationStatus } from '../controllers/applicationController';
import { upload } from '../utils/upload';

const router = express.Router();

router.post('/:jobId', upload.single('resume'), applyForJob);
router.get('/job/:jobId', getJobApplications);
router.put('/:id/status', updateApplicationStatus);

export default router;
