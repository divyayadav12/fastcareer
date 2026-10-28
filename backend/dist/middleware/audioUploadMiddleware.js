"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.audioUpload = exports.videoUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Ensure uploads folder exists
const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Reliable disk storage for videos and audios
const diskMediaStorage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        if (!fs_1.default.existsSync(uploadsDir)) {
            fs_1.default.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename(req, file, cb) {
        const isVideo = file.mimetype.startsWith('video/') || file.fieldname === 'video';
        const ext = path_1.default.extname(file.originalname) || '.webm';
        cb(null, `${isVideo ? 'video' : 'audio'}-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`);
    }
});
exports.videoUpload = (0, multer_1.default)({
    storage: diskMediaStorage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    fileFilter: (req, file, cb) => {
        // Accept all recording files
        cb(null, true);
    }
});
exports.audioUpload = exports.videoUpload;
exports.default = exports.videoUpload;
