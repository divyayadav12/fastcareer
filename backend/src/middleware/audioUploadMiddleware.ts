import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

// Cloudinary storage for audio
const cloudinaryAudioStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'fastweb_audio_assessments',
      resource_type: 'video', // Cloudinary classifies audio as 'video'
      format: 'webm',
      public_id: `assessment-audio-${Date.now()}-${Math.round(Math.random() * 1e4)}`
    };
  }
});

// Fallback disk storage
const diskAudioStorage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname) || '.webm';
    cb(null, `audio-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`);
  }
});

const storage = isCloudinaryConfigured ? cloudinaryAudioStorage : diskAudioStorage;

export const audioUpload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB for up to 3 mins audio
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/') || file.mimetype === 'video/webm' || file.mimetype === 'application/octet-stream') {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are permitted for recording upload.'));
    }
  }
});

export default audioUpload;
