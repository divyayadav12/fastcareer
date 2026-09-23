import express from 'express';
import upload from '../middleware/uploadMiddleware';
import fs from 'fs';
import { parseResumeBuffer } from '../utils/pdfParser';

const router = express.Router();

router.post('/', upload.single('resume'), (req, res) => {
  if (req.file) {
    const url = req.file.path.startsWith('http') 
      ? req.file.path 
      : `/${req.file.path.replace(/\\/g, '/')}`;

    let parsedData: any = {};

    try {
      if (req.file.path && fs.existsSync(req.file.path)) {
        const buffer = fs.readFileSync(req.file.path);
        parsedData = parseResumeBuffer(buffer, req.file.originalname || '');
      }
    } catch (err) {
      console.warn('Server resume parsing non-critical error:', err);
    }

    res.json({ url, resumeUrl: url, parsedData });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

// Dedicated parse-only route if needed
router.post('/parse', upload.single('resume'), (req, res) => {
  if (req.file) {
    const url = req.file.path.startsWith('http') 
      ? req.file.path 
      : `/${req.file.path.replace(/\\/g, '/')}`;

    let parsedData: any = {};
    try {
      if (req.file.path && fs.existsSync(req.file.path)) {
        const buffer = fs.readFileSync(req.file.path);
        parsedData = parseResumeBuffer(buffer, req.file.originalname || '');
      }
    } catch (err) {
      console.warn('Server parse error:', err);
    }

    res.json({ success: true, url, resumeUrl: url, parsedData });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

export default router;
