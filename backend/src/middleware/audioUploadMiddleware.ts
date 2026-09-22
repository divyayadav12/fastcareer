import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Reliable disk storage for videos and audios
const diskMediaStorage = multer.diskStorage({
  destination(req, file, cb) {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    const isVideo = file.mimetype.startsWith('video/') || file.fieldname === 'video';
    const ext = path.extname(file.originalname) || '.webm';
    cb(null, `${isVideo ? 'video' : 'audio'}-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`);
  }
});

export const videoUpload = multer({
  storage: diskMediaStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    // Accept all recording files
    cb(null, true);
  }
});

export const audioUpload = videoUpload;
export default videoUpload;
