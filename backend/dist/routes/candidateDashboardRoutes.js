"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const feedbackController_1 = require("../controllers/feedbackController");
const referralController_1 = require("../controllers/referralController");
const jobChangeController_1 = require("../controllers/jobChangeController");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const router = express_1.default.Router();
// Feedback Routes
router.route('/feedback')
    .post(authMiddleware_1.protect, feedbackController_1.submitFeedback)
    .get(authMiddleware_1.protect, authMiddleware_1.employerOrAdmin, feedbackController_1.getFeedbacks);
// Referral Routes
router.route('/referrals')
    .post(authMiddleware_1.protect, uploadMiddleware_1.default.single('resume'), referralController_1.submitReferral)
    .get(authMiddleware_1.protect, authMiddleware_1.employerOrAdmin, referralController_1.getReferrals);
// Job Change Routes
router.route('/job-change')
    .post(authMiddleware_1.protect, jobChangeController_1.submitJobChange)
    .get(authMiddleware_1.protect, authMiddleware_1.employerOrAdmin, jobChangeController_1.getJobChangeRequests);
exports.default = router;
