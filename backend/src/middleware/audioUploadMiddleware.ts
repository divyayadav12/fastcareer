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

// Cloudinary storage for audio and video assessments
const cloudinaryMediaStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/') || file.fieldname === 'video';
    return {
      folder: isVideo ? 'fastweb_video_assessments' : 'fastweb_audio_assessments',
      resource_type: 'video', // Cloudinary classifies both audio and video as 'video'
      format: 'webm',
      public_id: `assessment-${isVideo ? 'video' : 'media'}-${Date.now()}-${Math.round(Math.random() * 1e4)}`
    };
  }
});

// Fallback disk storage
const diskMediaStorage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    const isVideo = file.mimetype.startsWith('video/') || file.fieldname === 'video';
    const ext = path.extname(file.originalname) || '.webm';
    cb(null, `${isVideo ? 'video' : 'media'}-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`);
  }
});

const storage = isCloudinaryConfigured ? cloudinaryMediaStorage : diskMediaStorage;

export const videoUpload = multer({
  storage,
  limits: { fileSize: 75 * 1024 * 1024 }, // 75MB for up to 3 mins HD video
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('video/') || 
      file.mimetype.startsWith('audio/') || 
      file.mimetype === 'application/octet-stream'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only video and audio files are permitted for recording upload.'));
    }
  }
});

export const audioUpload = videoUpload;
export default videoUpload;
