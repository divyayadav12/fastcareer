"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobController_1 = require("../controllers/jobController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/cleanup-test-jobs').post(authMiddleware_1.protect, authMiddleware_1.employerOrAdmin, jobController_1.cleanupTestJobs);
router.route('/').get(jobController_1.getJobs).post(authMiddleware_1.protect, authMiddleware_1.employerOrAdmin, jobController_1.createJob);
router.route('/employer').get(authMiddleware_1.protect, authMiddleware_1.employerOrAdmin, jobController_1.getEmployerJobs);
router.route('/:id').get(jobController_1.getJobById).put(authMiddleware_1.protect, authMiddleware_1.employerOrAdmin, jobController_1.updateJob).delete(authMiddleware_1.protect, authMiddleware_1.employerOrAdmin, jobController_1.deleteJob);
router.route('/:id/match/:userId').get(authMiddleware_1.protect, jobController_1.getJobMatchScore);
exports.default = router;
