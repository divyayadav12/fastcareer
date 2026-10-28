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
exports.getSharedJobs = exports.createSharedJob = void 0;
const SharedJob_1 = __importDefault(require("../models/SharedJob"));
// @desc    Share a new job opportunity
// @route   POST /api/shared-jobs
// @access  Public (or Private if we want to enforce login)
const createSharedJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { industry, companyName, jobDescription, location, region, noOfPost, concernedPerson, mobileNo, emailId } = req.body;
        const sharedJob = yield SharedJob_1.default.create({
            industry,
            companyName,
            jobDescription,
            location,
            region,
            noOfPost,
            concernedPerson,
            mobileNo,
            emailId,
            // @ts-ignore
            submittedBy: ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || null
        });
        res.status(201).json(sharedJob);
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Error creating shared job' });
    }
});
exports.createSharedJob = createSharedJob;
// @desc    Get all shared jobs
// @route   GET /api/shared-jobs
// @access  Private/Admin
const getSharedJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sharedJobs = yield SharedJob_1.default.find({}).populate('submittedBy', 'firstName lastName email').sort({ createdAt: -1 });
        res.json(sharedJobs);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getSharedJobs = getSharedJobs;
