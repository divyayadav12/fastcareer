import express from 'express';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.post('/', upload.single('resume'), (req, res) => {
  if (req.file) {
    const url = req.file.path.startsWith('http') 
      ? req.file.path 
      : `/${req.file.path.replace(/\\/g, '/')}`;
    res.json({ url });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

export default router;
