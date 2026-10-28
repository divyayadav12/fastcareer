"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.memoryStorage();
function checkExcelFileType(file, cb) {
    const allowedExts = ['.xlsx', '.xls'];
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
        return cb(null, true);
    }
    cb(new Error('Only Excel files (.xlsx, .xls) are allowed!'));
}
const excelUpload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
    fileFilter: (req, file, cb) => {
        checkExcelFileType(file, cb);
    },
});
exports.default = excelUpload;
