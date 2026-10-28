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
exports.reviewAssessment = exports.getAllAssessments = exports.getMyAssessment = exports.submitAssessment = exports.uploadVideo = exports.uploadAudio = void 0;
const Assessment_1 = __importDefault(require("../models/Assessment"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const isCloudinaryConfigured = !!(process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET);
// Answer key for auto-grading MCQs (both Fresher and Experienced forms)
const MCQ_CORRECT_ANSWERS = [
    'when performance obligation is satisfied and control is transferred to the customer',
    '20th of the succeeding month',
    'amortised cost',
    '25.168%'
];
const getBaseUrl = (req) => {
    const host = req.get('host') || 'fastcareerwebside.onrender.com';
    const protocol = req.protocol === 'http' && !host.includes('localhost') ? 'https' : req.protocol;
    return `${protocol}://${host}`;
};
const normalizeAnswers = (answers, baseUrl) => {
    if (!Array.isArray(answers))
        return answers;
    return answers.map(ans => {
        const a = ans && typeof ans.toObject === 'function' ? ans.toObject() : Object.assign({}, ans);
        if (a.candidateAnswer && typeof a.candidateAnswer === 'string' && a.candidateAnswer.startsWith('/uploads/')) {
            a.candidateAnswer = `${baseUrl}${a.candidateAnswer}`;
        }
        return a;
    });
};
// @desc    Upload recorded audio file for assessment
// @route   POST /api/assessments/upload-audio
// @access  Private (Candidate)
const uploadAudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No audio file provided' });
            return;
        }
        const baseUrl = getBaseUrl(req);
        const localUrl = `${baseUrl}/uploads/${req.file.filename}`;
        let finalUrl = localUrl;
        if (isCloudinaryConfigured) {
            try {
                const cloudResult = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                    folder: 'fastweb_audio_assessments',
                    resource_type: 'video',
                    timeout: 120000,
                    public_id: `audio-${Date.now()}-${Math.round(Math.random() * 1e4)}`
                });
                if (cloudResult && cloudResult.secure_url) {
                    finalUrl = cloudResult.secure_url;
                }
            }
            catch (audioErr) {
                console.warn('Cloudinary audio upload video type failed, falling back to raw:', audioErr);
                try {
                    const ext = path_1.default.extname(req.file.filename) || '.webm';
                    const rawResult = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                        folder: 'fastweb_audio_assessments',
                        resource_type: 'raw',
                        timeout: 120000,
                        public_id: `audio-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`
                    });
                    if (rawResult && rawResult.secure_url) {
                        finalUrl = rawResult.secure_url;
                    }
                }
                catch (rawErr) {
                    console.error('Cloudinary audio raw fallback failed:', rawErr);
                }
            }
        }
        res.json({
            message: 'Audio uploaded successfully',
            audioUrl: finalUrl,
            mediaUrl: finalUrl
        });
    }
    catch (error) {
        console.error('Error uploading assessment audio:', error);
        res.status(500).json({ message: 'Server error during audio upload', error });
    }
});
exports.uploadAudio = uploadAudio;
// @desc    Upload recorded video file for assessment
// @route   POST /api/assessments/upload-video
// @access  Private (Candidate)
const uploadVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No video file provided' });
            return;
        }
        const baseUrl = getBaseUrl(req);
        const localUrl = `${baseUrl}/uploads/${req.file.filename}`;
        let finalUrl = localUrl;
        if (isCloudinaryConfigured) {
            try {
                // 1. Upload as 'video' which supports up to 100MB on free accounts
                const cloudResult = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                    folder: 'fastweb_video_assessments',
                    resource_type: 'video',
                    timeout: 120000,
                    public_id: `video-${Date.now()}-${Math.round(Math.random() * 1e4)}`
                });
                if (cloudResult && cloudResult.secure_url) {
                    finalUrl = cloudResult.secure_url;
                }
            }
            catch (videoErr) {
                console.warn('Cloudinary video upload failed, attempting raw upload fallback:', videoErr);
                // 2. Fallback to 'raw' if transcode had any issues
                try {
                    const ext = path_1.default.extname(req.file.filename) || '.webm';
                    const rawResult = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                        folder: 'fastweb_video_assessments',
                        resource_type: 'raw',
                        timeout: 120000,
                        public_id: `video-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`
                    });
                    if (rawResult && rawResult.secure_url) {
                        finalUrl = rawResult.secure_url;
                    }
                }
                catch (rawErr) {
                    console.error('Cloudinary raw upload fallback also failed:', rawErr);
                }
            }
        }
        res.json({
            message: 'Video uploaded successfully',
            videoUrl: finalUrl,
            mediaUrl: finalUrl
        });
    }
    catch (error) {
        console.error('Error uploading assessment video:', error);
        res.status(500).json({ message: 'Server error during video upload', error });
    }
});
exports.uploadVideo = uploadVideo;
// @desc    Submit 6-question fast selection assessment
// @route   POST /api/assessments/submit
// @access  Private (Candidate)
const submitAssessment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const candidateId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { answers } = req.body;
        if (!answers || !Array.isArray(answers) || answers.length !== 6) {
            res.status(400).json({
                message: 'All 6 assessment questions must be answered before submission (2 MCQs, 2 Written, 2 Video/Voice Recordings).'
            });
            return;
        }
        let mcqScore = 0;
        const processedAnswers = answers.map((ans) => {
            let isCorrect = undefined;
            if (ans.type === 'mcq') {
                const candidateAnsNorm = (ans.candidateAnswer || '').trim().toLowerCase();
                const isMatch = MCQ_CORRECT_ANSWERS.some(correct => candidateAnsNorm === correct || candidateAnsNorm.includes(correct));
                if (isMatch) {
                    isCorrect = true;
                    mcqScore += 1;
                }
                else {
                    isCorrect = false;
                }
            }
            return {
                questionId: ans.questionId,
                questionText: ans.questionText || `Question ${ans.questionId}`,
                type: ans.type || 'video',
                candidateAnswer: ans.candidateAnswer || '',
                audioDurationSeconds: ans.audioDurationSeconds || ans.videoDurationSeconds || 0,
                videoDurationSeconds: ans.videoDurationSeconds || ans.audioDurationSeconds || 0,
                isCorrect
            };
        });
        // Check if candidate already has an assessment
        let assessment = yield Assessment_1.default.findOne({ candidate: candidateId });
        if (assessment) {
            assessment.answers = processedAnswers;
            assessment.mcqScore = mcqScore;
            assessment.totalMcqQuestions = 2;
            assessment.status = 'submitted';
            yield assessment.save();
        }
        else {
            assessment = yield Assessment_1.default.create({
                candidate: candidateId,
                answers: processedAnswers,
                mcqScore,
                totalMcqQuestions: 2,
                status: 'submitted'
            });
        }
        res.status(201).json({
            message: 'Assessment submitted successfully! Fast-track evaluation initiated.',
            assessment
        });
    }
    catch (error) {
        console.error('Error submitting assessment:', error);
        res.status(500).json({ message: 'Server error during assessment submission', error });
    }
});
exports.submitAssessment = submitAssessment;
// @desc    Get candidate's own assessment status and results
// @route   GET /api/assessments/my
// @access  Private (Candidate)
const getMyAssessment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const candidateId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const assessment = yield Assessment_1.default.findOne({ candidate: candidateId });
        if (!assessment) {
            res.json(null);
            return;
        }
        const baseUrl = getBaseUrl(req);
        const a = assessment.toObject();
        a.answers = normalizeAnswers(a.answers, baseUrl);
        res.json(a);
    }
    catch (error) {
        console.error('Error fetching candidate assessment:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getMyAssessment = getMyAssessment;
// @desc    Get all candidate assessment results for Admin review
// @route   GET /api/assessments
// @access  Private (Admin / Employer)
const getAllAssessments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assessments = yield Assessment_1.default.find({})
            .populate('candidate', 'firstName lastName email phone qualifications caPortfolio experience personalDetails resumeUrl')
            .populate('reviewedBy', 'firstName lastName email')
            .sort({ createdAt: -1 });
        // Filter out submissions where candidate account was deleted
        const validAssessments = assessments.filter(a => a.candidate);
        const baseUrl = getBaseUrl(req);
        const formattedAssessments = validAssessments.map(doc => {
            const a = doc.toObject();
            a.answers = normalizeAnswers(a.answers, baseUrl);
            return a;
        });
        res.json(formattedAssessments);
    }
    catch (error) {
        console.error('Error fetching assessments for admin:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getAllAssessments = getAllAssessments;
// @desc    Admin review and evaluate candidate test submission
// @route   PUT /api/assessments/:id/review
// @access  Private (Admin / Employer)
const reviewAssessment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { status, adminNotes, adminRating } = req.body;
        const reviewerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const assessment = yield Assessment_1.default.findById(req.params.id);
        if (!assessment) {
            res.status(404).json({ message: 'Assessment not found' });
            return;
        }
        if (status)
            assessment.status = status;
        if (adminNotes !== undefined)
            assessment.adminNotes = adminNotes;
        if (adminRating !== undefined)
            assessment.adminRating = adminRating;
        assessment.reviewedBy = reviewerId;
        assessment.reviewedAt = new Date();
        const updated = yield assessment.save();
        res.json({
            message: 'Assessment review updated successfully',
            assessment: updated
        });
    }
    catch (error) {
        console.error('Error reviewing assessment:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.reviewAssessment = reviewAssessment;
