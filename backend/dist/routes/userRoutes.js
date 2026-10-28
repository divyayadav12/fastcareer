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
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const excelUploadMiddleware_1 = __importDefault(require("../middleware/excelUploadMiddleware"));
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const whatsappService_1 = require("../utils/whatsappService");
const router = express_1.default.Router();
router.get('/test-live-whatsapp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const phone = req.query.phone || '8839250427';
    const name = req.query.name || 'Divya Yadav';
    const result = yield (0, whatsappService_1.sendRegistrationWhatsApp)(phone, name);
    res.json({
        success: result,
        phone,
        name,
        timestamp: new Date().toISOString()
    });
}));
router.route('/').post(userController_1.registerUser);
router.get('/check-email', userController_1.checkEmail);
router.post('/login', userController_1.authUser);
router.post('/upload-resume', uploadMiddleware_1.default.single('resume'), (req, res) => {
    if (req.file) {
        const url = req.file.path.startsWith('http')
            ? req.file.path
            : `/${req.file.path.replace(/\\/g, '/')}`;
        res.json({ url, resumeUrl: url });
    }
    else {
        res.status(400).json({ message: 'No file uploaded' });
    }
});
router.route('/profile').get(authMiddleware_1.protect, userController_1.getUserProfile).put(authMiddleware_1.protect, userController_1.updateUserProfile);
router.route('/candidates').get(authMiddleware_1.protect, authMiddleware_1.employerOrAdmin, userController_1.getCandidates);
router.put('/candidates/assign-company', authMiddleware_1.protect, authMiddleware_1.admin, userController_1.assignCandidatesToCompany);
router.route('/employers').get(authMiddleware_1.protect, authMiddleware_1.employerOrAdmin, userController_1.getEmployers);
router.route('/employees')
    .post(authMiddleware_1.protect, authMiddleware_1.admin, userController_1.createEmployee)
    .get(authMiddleware_1.protect, authMiddleware_1.admin, userController_1.getEmployees);
router.route('/employees/:id')
    .delete(authMiddleware_1.protect, authMiddleware_1.admin, userController_1.deleteEmployee);
router.get('/candidates/:id/resume', userController_1.getCandidateResume);
router.get('/resume/:id', userController_1.getCandidateResume);
router.post('/candidates/match-excel', authMiddleware_1.protect, authMiddleware_1.employerOrAdmin, excelUploadMiddleware_1.default.single('file'), userController_1.matchCandidatesFromExcel);
router.post('/candidates/download-resumes-zip', authMiddleware_1.protect, authMiddleware_1.employerOrAdmin, userController_1.downloadCandidateResumesZip);
router.get('/seed-10-candidates', userController_1.seed10CandidatesController);
router.get('/seed-test-candidates', userController_1.seedLiveCandidates);
router.get('/seed-50-candidates', userController_1.seed50Candidates);
router.post('/cleanup-db', authMiddleware_1.protect, authMiddleware_1.admin, userController_1.cleanupDbAndFixResumes);
router.post('/seed-test-candidates', userController_1.seedLiveCandidates);
exports.default = router;
