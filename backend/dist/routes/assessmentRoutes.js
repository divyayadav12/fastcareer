"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assessmentController_1 = require("../controllers/assessmentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const audioUploadMiddleware_1 = __importStar(require("../middleware/audioUploadMiddleware"));
const router = express_1.default.Router();
// Candidate endpoints
router.post('/upload-audio', authMiddleware_1.protect, audioUploadMiddleware_1.default.single('audio'), assessmentController_1.uploadAudio);
router.post('/upload-video', authMiddleware_1.protect, audioUploadMiddleware_1.videoUpload.single('video'), assessmentController_1.uploadVideo);
router.post('/submit', authMiddleware_1.protect, assessmentController_1.submitAssessment);
router.get('/my', authMiddleware_1.protect, assessmentController_1.getMyAssessment);
// Admin / Employer endpoints
router.get('/', authMiddleware_1.protect, authMiddleware_1.employerOrAdmin, assessmentController_1.getAllAssessments);
router.put('/:id/review', authMiddleware_1.protect, authMiddleware_1.employerOrAdmin, assessmentController_1.reviewAssessment);
exports.default = router;
