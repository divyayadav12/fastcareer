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

// Cloudinary configure karo ek baar
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to stream upload buffer to Cloudinary
const uploadBufferToCloudinary = (buffer: Buffer, originalname: string, mimetype: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const isPdf = mimetype?.includes('pdf') || originalname?.toLowerCase().endsWith('.pdf');
    const isImage = mimetype?.startsWith('image/') || /\.(png|jpg|jpeg|webp)$/i.test(originalname);
    const isVideo = mimetype?.startsWith('video/') || /\.(mp4|mov|webm|avi|mkv)$/i.test(originalname);
    const isAudio = mimetype?.startsWith('audio/') || /\.(mp3|wav|m4a)$/i.test(originalname);

    // PDFs ke liye 'raw' use karo taaki direct download mile
    let resourceType: 'image' | 'video' | 'raw' | 'auto' = 'raw';
    if (isImage) {
      resourceType = 'image';
    } else if (isVideo || isAudio) {
      resourceType = 'video';
    }

    const cleanField = originalname ? originalname.replace(/[^a-zA-Z0-9]/g, '_') : 'resume';
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'fastweb_resumes',
        resource_type: resourceType,
        public_id: `${cleanField}-${Date.now()}`,
        // PDF ke liye flags
        ...(isPdf && { format: 'pdf', flags: 'attachment' }),
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

// Unified processor for Base64 payloads (Cloudinary first, local fallback)
async function handleBase64Upload(base64: string, filename?: string, mimeType?: string) {
  const cleanBase64 = base64.replace(/^data:[^;]+;base64,/, '');
  const buffer = Buffer.from(cleanBase64, 'base64');
  const originalName = filename || 'resume.pdf';
  const cleanMime = mimeType || 'application/pdf';

  let finalUrl = '';

  // 1. Pehle Cloudinary pe upload karo (production ke liye zaroori)
  if (isCloudinaryConfigured) {
    try {
      finalUrl = await uploadBufferToCloudinary(buffer, originalName, cleanMime);
      console.log('[Upload] Cloudinary upload success:', finalUrl);
    } catch (cloudErr) {
      console.warn('[Upload] Cloudinary failed, falling back to local:', cloudErr);
    }
  }

  // 2. Agar Cloudinary fail ho ya configured na ho to local save karo
  if (!finalUrl) {
    finalUrl = saveBufferToLocal(buffer, originalName);
    console.log('[Upload] Saved locally:', finalUrl);
  }

  return {
    success: true,
    url: finalUrl,
    resumeUrl: finalUrl,
    parsedData: {},
  };
}

// 1. Base64 Upload Endpoint
router.post('/base64', async (req: any, res: any) => {
  try {
    const { base64, filename, mimeType } = req.body;
    if (!base64) {
      return res.status(400).json({ message: 'No base64 data provided' });
    }
    const result = await handleBase64Upload(base64, filename, mimeType);
    return res.json(result);
  } catch (err: any) {
    console.error('Base64 upload exception:', err);
    return res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// 2. Root Upload Endpoint (handles both Multipart and Base64 JSON)
router.post('/', async (req: any, res: any, next: any) => {
  if (req.body && req.body.base64) {
    try {
      const result = await handleBase64Upload(req.body.base64, req.body.filename, req.body.mimeType);
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ message: 'Upload failed', error: e.message });
    }
  }

  upload.single('resume')(req, res, async (err) => {
    if (err) {
      console.warn('Multer error:', err);
      return res.status(400).json({ message: err.message || 'File upload error' });
    }

    if (!req.file || !req.file.buffer) {
      if (req.body && req.body.base64) {
        const result = await handleBase64Upload(req.body.base64, req.body.filename, req.body.mimeType);
        return res.json(result);
      }
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const originalName = req.file.originalname || req.body?.originalname || 'resume.pdf';
    const mimeType = req.file.mimetype || 'application/pdf';

    let finalUrl = '';

    // 1. Pehle Cloudinary pe upload karo
    if (isCloudinaryConfigured) {
      try {
        finalUrl = await uploadBufferToCloudinary(req.file.buffer, originalName, mimeType);
        console.log('[Upload] Cloudinary upload success:', finalUrl);
      } catch (cloudErr) {
        console.warn('[Upload] Cloudinary failed, falling back to local:', cloudErr);
      }
    }

    // 2. Agar Cloudinary fail ho to local save karo
    if (!finalUrl) {
      finalUrl = saveBufferToLocal(req.file.buffer, originalName);
      console.log('[Upload] Saved locally:', finalUrl);
    }

    return res.json({
      url: finalUrl,
      resumeUrl: finalUrl,
      parsedData: {},
      success: true,
    });
  });
});

// 3. Dedicated parse route
router.post('/parse', upload.single('resume'), async (req: any, res: any) => {
  if (req.body && req.body.base64) {
    const result = await handleBase64Upload(req.body.base64, req.body.filename, req.body.mimeType);
    return res.json(result);
  }

  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const originalName = req.file.originalname || req.body?.originalname || 'resume.pdf';
  const mimeType = req.file.mimetype || 'application/pdf';

  let finalUrl = '';
  let parsedData: any = {};

  try {
    parsedData = await parseResumeBuffer(req.file.buffer, originalName);
  } catch (err) {
    console.warn('Server parse error:', err);
  }

  try {
    if (isCloudinaryConfigured) {
      finalUrl = await uploadBufferToCloudinary(
        req.file.buffer,
        originalName,
        mimeType
      );
    }
  } catch (cloudErr) {}

  if (!finalUrl) {
    finalUrl = saveBufferToLocal(req.file.buffer, originalName);
  }

  return res.json({
    success: true,
    url: finalUrl,
    resumeUrl: finalUrl,
    parsedData,
  });
});

export default router;
