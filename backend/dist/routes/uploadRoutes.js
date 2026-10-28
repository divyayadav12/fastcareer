"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const pdfParser_1 = require("../utils/pdfParser");
const router = express_1.default.Router();
const isCloudinaryConfigured = Boolean(process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET);
// Cloudinary configure karo ek baar
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Helper to stream upload buffer to Cloudinary
const uploadBufferToCloudinary = (buffer, originalname, mimetype) => {
    return new Promise((resolve, reject) => {
        const isPdf = (mimetype === null || mimetype === void 0 ? void 0 : mimetype.includes('pdf')) || (originalname === null || originalname === void 0 ? void 0 : originalname.toLowerCase().endsWith('.pdf'));
        const isImage = (mimetype === null || mimetype === void 0 ? void 0 : mimetype.startsWith('image/')) || /\.(png|jpg|jpeg|webp)$/i.test(originalname);
        const isVideo = (mimetype === null || mimetype === void 0 ? void 0 : mimetype.startsWith('video/')) || /\.(mp4|mov|webm|avi|mkv)$/i.test(originalname);
        const isAudio = (mimetype === null || mimetype === void 0 ? void 0 : mimetype.startsWith('audio/')) || /\.(mp3|wav|m4a)$/i.test(originalname);
        // PDFs ke liye 'raw' use karo taaki direct download mile
        let resourceType = 'raw';
        if (isImage) {
            resourceType = 'image';
        }
        else if (isVideo || isAudio) {
            resourceType = 'video';
        }
        const cleanField = originalname ? originalname.replace(/[^a-zA-Z0-9]/g, '_') : 'resume';
        const uploadStream = cloudinary_1.v2.uploader.upload_stream(Object.assign({ folder: 'fastweb_resumes', resource_type: resourceType, public_id: `${cleanField}-${Date.now()}` }, (isPdf && { format: 'pdf', flags: 'attachment' })), (error, result) => {
            if (error) {
                console.warn('Cloudinary upload error:', error);
                return reject(error);
            }
            resolve((result === null || result === void 0 ? void 0 : result.secure_url) || (result === null || result === void 0 ? void 0 : result.url) || '');
        });
        uploadStream.end(buffer);
    });
};
// Helper to save buffer to local uploads directory
const saveBufferToLocal = (buffer, originalname) => {
    const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
    }
    const cleanExt = path_1.default.extname(originalname) || '.pdf';
    const cleanName = path_1.default.basename(originalname, cleanExt).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${cleanName}-${Date.now()}${cleanExt}`;
    const filePath = path_1.default.join(uploadsDir, filename);
    fs_1.default.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
};
// Unified processor for Base64 payloads (Cloudinary first, local fallback)
function handleBase64Upload(base64, filename, mimeType) {
    return __awaiter(this, void 0, void 0, function* () {
        const cleanBase64 = base64.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(cleanBase64, 'base64');
        const originalName = filename || 'resume.pdf';
        const cleanMime = mimeType || 'application/pdf';
        let finalUrl = '';
        // 1. Pehle Cloudinary pe upload karo (production ke liye zaroori)
        if (isCloudinaryConfigured) {
            try {
                finalUrl = yield uploadBufferToCloudinary(buffer, originalName, cleanMime);
                console.log('[Upload] Cloudinary upload success:', finalUrl);
            }
            catch (cloudErr) {
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
    });
}
// 1. Base64 Upload Endpoint
router.post('/base64', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { base64, filename, mimeType } = req.body;
        if (!base64) {
            return res.status(400).json({ message: 'No base64 data provided' });
        }
        const result = yield handleBase64Upload(base64, filename, mimeType);
        return res.json(result);
    }
    catch (err) {
        console.error('Base64 upload exception:', err);
        return res.status(500).json({ message: 'Upload failed', error: err.message });
    }
}));
// 2. Root Upload Endpoint (handles both Multipart and Base64 JSON)
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body && req.body.base64) {
        try {
            const result = yield handleBase64Upload(req.body.base64, req.body.filename, req.body.mimeType);
            return res.json(result);
        }
        catch (e) {
            return res.status(500).json({ message: 'Upload failed', error: e.message });
        }
    }
    uploadMiddleware_1.default.single('resume')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (err) {
            console.warn('Multer error:', err);
            return res.status(400).json({ message: err.message || 'File upload error' });
        }
        if (!req.file || !req.file.buffer) {
            if (req.body && req.body.base64) {
                const result = yield handleBase64Upload(req.body.base64, req.body.filename, req.body.mimeType);
                return res.json(result);
            }
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const originalName = req.file.originalname || ((_a = req.body) === null || _a === void 0 ? void 0 : _a.originalname) || 'resume.pdf';
        const mimeType = req.file.mimetype || 'application/pdf';
        let finalUrl = '';
        // 1. Pehle Cloudinary pe upload karo
        if (isCloudinaryConfigured) {
            try {
                finalUrl = yield uploadBufferToCloudinary(req.file.buffer, originalName, mimeType);
                console.log('[Upload] Cloudinary upload success:', finalUrl);
            }
            catch (cloudErr) {
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
    }));
}));
// 3. Dedicated parse route
router.post('/parse', uploadMiddleware_1.default.single('resume'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.body && req.body.base64) {
        const result = yield handleBase64Upload(req.body.base64, req.body.filename, req.body.mimeType);
        return res.json(result);
    }
    if (!req.file || !req.file.buffer) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const originalName = req.file.originalname || ((_a = req.body) === null || _a === void 0 ? void 0 : _a.originalname) || 'resume.pdf';
    const mimeType = req.file.mimetype || 'application/pdf';
    let finalUrl = '';
    let parsedData = {};
    try {
        parsedData = yield (0, pdfParser_1.parseResumeBuffer)(req.file.buffer, originalName);
    }
    catch (err) {
        console.warn('Server parse error:', err);
    }
    try {
        if (isCloudinaryConfigured) {
            finalUrl = yield uploadBufferToCloudinary(req.file.buffer, originalName, mimeType);
        }
    }
    catch (cloudErr) { }
    if (!finalUrl) {
        finalUrl = saveBufferToLocal(req.file.buffer, originalName);
    }
    return res.json({
        success: true,
        url: finalUrl,
        resumeUrl: finalUrl,
        parsedData,
    });
}));
exports.default = router;
