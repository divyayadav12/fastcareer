"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Use memory storage so req.file.buffer is always available for parsing and streaming
const storage = multer_1.default.memoryStorage();
function checkFileType(file, cb) {
    const ext = path_1.default.extname(file.originalname || '').toLowerCase();
    const allowedExts = /\.(pdf|doc|docx|mp4|mov|mkv|webm|avi|mp3|wav|m4a|png|jpg|jpeg)$/i;
    const isExtValid = allowedExts.test(ext);
    const mime = file.mimetype || '';
    const isMimeValid = !mime || /(pdf|msword|word|document|video|audio|image|octet-stream)/i.test(mime);
    if (isExtValid || isMimeValid) {
        return cb(null, true);
    }
    else {
        // If extension or mime is loose, still allow to prevent unexpected upload blocks
        return cb(null, true);
    }
}
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max file size
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});
exports.default = upload;
