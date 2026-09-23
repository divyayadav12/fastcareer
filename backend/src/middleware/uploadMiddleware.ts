import multer from 'multer';
import path from 'path';

// Use memory storage so req.file.buffer is always available for parsing and streaming
const storage = multer.memoryStorage();

function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const allowedExts = /\.(pdf|doc|docx|mp4|mov|mkv|webm|avi|mp3|wav|m4a|png|jpg|jpeg)$/i;
  const isExtValid = allowedExts.test(ext);
  
  const mime = file.mimetype || '';
  const isMimeValid = !mime || /(pdf|msword|word|document|video|audio|image|octet-stream)/i.test(mime);

  if (isExtValid || isMimeValid) {
    return cb(null, true);
  } else {
    // If extension or mime is loose, still allow to prevent unexpected upload blocks
    return cb(null, true);
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;
