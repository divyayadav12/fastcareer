import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

function checkExcelFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const allowedExts = ['.xlsx', '.xls'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExts.includes(ext)) {
    return cb(null, true);
  }
  cb(new Error('Only Excel files (.xlsx, .xls) are allowed!'));
}

const excelUpload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    checkExcelFileType(file, cb);
  },
});

export default excelUpload;
