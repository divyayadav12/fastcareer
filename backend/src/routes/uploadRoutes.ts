import express from 'express';
import upload from '../middleware/uploadMiddleware';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { parseResumeBuffer } from '../utils/pdfParser';

const router = express.Router();

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET
);

// Helper to stream upload buffer to Cloudinary
const uploadBufferToCloudinary = (buffer: Buffer, originalname: string, mimetype: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const isPdf = mimetype?.includes('pdf') || originalname?.toLowerCase().endsWith('.pdf');
    const isImage = mimetype?.startsWith('image/') || /\.(png|jpg|jpeg|webp)$/i.test(originalname);
    const isVideo = mimetype?.startsWith('video/') || /\.(mp4|mov|webm|avi|mkv)$/i.test(originalname);
    const isAudio = mimetype?.startsWith('audio/') || /\.(mp3|wav|m4a)$/i.test(originalname);

    let resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto';
    if (isPdf || isImage) {
      resourceType = 'image'; // Cloudinary allows PDF delivery under image resource type
    } else if (isVideo || isAudio) {
      resourceType = 'video';
    } else {
      resourceType = 'raw';
    }

    const cleanField = originalname ? originalname.replace(/[^a-zA-Z0-9]/g, '_') : 'file';
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'fastweb_resumes',
        resource_type: resourceType,
        public_id: `${cleanField}-${Date.now()}`,
      },
      (error, result) => {
        if (error) {
          console.warn('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve(result?.secure_url || result?.url || '');
      }
    );

    uploadStream.end(buffer);
  });
};

// Helper to save buffer to local uploads directory
const saveBufferToLocal = (buffer: Buffer, originalname: string): string => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const cleanExt = path.extname(originalname) || '.pdf';
  const cleanName = path.basename(originalname, cleanExt).replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${cleanName}-${Date.now()}${cleanExt}`;
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`;
};

router.post('/', upload.single('resume'), async (req: any, res: any) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  let finalUrl = '';
  let parsedData: any = {};

  // 1. Immediately parse the buffer for extracted resume details
  try {
    parsedData = parseResumeBuffer(req.file.buffer, req.file.originalname || '');
  } catch (err) {
    console.warn('Server resume parsing non-critical warning:', err);
  }

  // 2. Upload to Cloudinary or fallback to Local Disk
  try {
    if (isCloudinaryConfigured) {
      finalUrl = await uploadBufferToCloudinary(
        req.file.buffer, 
        req.file.originalname || 'resume.pdf',
        req.file.mimetype || 'application/pdf'
      );
    }
  } catch (cloudinaryErr) {
    console.warn('Cloudinary upload fallback to disk storage:', cloudinaryErr);
  }

  if (!finalUrl) {
    finalUrl = saveBufferToLocal(req.file.buffer, req.file.originalname || 'resume.pdf');
  }

  return res.json({
    url: finalUrl,
    resumeUrl: finalUrl,
    parsedData,
    success: true,
  });
});

// Dedicated parse route
router.post('/parse', upload.single('resume'), async (req: any, res: any) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  let finalUrl = '';
  let parsedData: any = {};

  try {
    parsedData = parseResumeBuffer(req.file.buffer, req.file.originalname || '');
  } catch (err) {
    console.warn('Server parse error:', err);
  }

  try {
    if (isCloudinaryConfigured) {
      finalUrl = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname || 'resume.pdf',
        req.file.mimetype || 'application/pdf'
      );
    }
  } catch (cloudErr) {}

  if (!finalUrl) {
    finalUrl = saveBufferToLocal(req.file.buffer, req.file.originalname || 'resume.pdf');
  }

  return res.json({
    success: true,
    url: finalUrl,
    resumeUrl: finalUrl,
    parsedData,
  });
});

export default router;
