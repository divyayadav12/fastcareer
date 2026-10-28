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
exports.getJobMatchScore = exports.cleanupTestJobs = exports.deleteJob = exports.updateJob = exports.createJob = exports.getJobById = exports.getEmployerJobs = exports.getJobs = void 0;
const Job_1 = __importDefault(require("../models/Job"));
const User_1 = __importDefault(require("../models/User"));
const Application_1 = __importDefault(require("../models/Application"));
const matchAlgorithm_1 = require("../utils/matchAlgorithm");
const locationHelper_1 = require("../utils/locationHelper");
// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield Job_1.default.find({}).sort({ createdAt: -1 });
        res.json(jobs);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getJobs = getJobs;
// @desc    Get logged in employer's jobs (or all jobs for admin)
// @route   GET /api/jobs/employer
// @access  Private/Employer/Admin
const getEmployerJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        let query = {};
        if ((user === null || user === void 0 ? void 0 : user.role) === 'admin') {
            query = {};
        }
        else {
            query = {
                $or: [
                    { postedBy: user._id },
                    { targetEmployers: user._id },
                    { sharedHrEmails: user.email }
                ]
            };
        }
        const jobs = yield Job_1.default.find(query)
            .populate('targetEmployers', 'companyName firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(jobs);
    }
    catch (error) {
        console.error('Error fetching employer jobs:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getEmployerJobs = getEmployerJobs;
// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job = yield Job_1.default.findById(req.params.id).populate('targetEmployers', 'companyName firstName lastName email');
        if (job) {
            res.json(job);
        }
        else {
            res.status(404).json({ message: 'Job not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getJobById = getJobById;
// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Employer
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, company, location, type, category, salaryRange, description, requirements, responsibilities, targetEmployers, sharedHrEmails } = req.body;
        if (!title || !title.trim()) {
            res.status(400).json({ message: 'Job title is required.' });
            return;
        }
        if (!company || !company.trim()) {
            res.status(400).json({ message: 'Company name is required.' });
            return;
        }
        const safeDesc = (description && description.trim())
            ? description.trim()
            : `${title.trim()} opening at ${company.trim()}${location ? ` in ${location.trim()}` : ''}. Type: ${type || 'Full-time'}. Category: ${category || 'Finance'}. Salary/Stipend: ${salaryRange || 'Competitive'}.`;
        const safeReq = (Array.isArray(requirements) && requirements.length > 0)
            ? requirements
            : (typeof requirements === 'string' && requirements.trim() ? requirements.split('\n').filter(Boolean) : [`Relevant experience in ${category || 'Finance'}`]);
        const safeResp = (Array.isArray(responsibilities) && responsibilities.length > 0)
            ? responsibilities
            : (typeof responsibilities === 'string' && responsibilities.trim() ? responsibilities.split('\n').filter(Boolean) : [`Core responsibilities as ${title.trim()}`]);
        let resolvedTargetEmployers = Array.isArray(targetEmployers) ? [...targetEmployers] : [];
        if (Array.isArray(sharedHrEmails) && sharedHrEmails.length > 0) {
            const hrUsers = yield User_1.default.find({
                email: { $in: sharedHrEmails.map((e) => new RegExp(`^${e.trim()}$`, 'i')) }
            }).select('_id');
            const hrUserIds = hrUsers.map(u => u._id.toString());
            for (const uid of hrUserIds) {
                if (!resolvedTargetEmployers.includes(uid)) {
                    resolvedTargetEmployers.push(uid);
                }
            }
        }
        const job = new Job_1.default(Object.assign(Object.assign({}, req.body), { title: title.trim(), company: company.trim(), location: (location || 'Pan India').trim(), type: type || 'Full-time', category: category || 'Auditing', salaryRange: salaryRange || 'Not Disclosed', description: safeDesc, requirements: safeReq, responsibilities: safeResp, targetEmployers: resolvedTargetEmployers, sharedHrEmails: sharedHrEmails || [], shareShortlistedCandidates: req.body.shareShortlistedCandidates !== false, postedBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }));
        const createdJob = yield job.save();
        const populatedJob = yield Job_1.default.findById(createdJob._id).populate('targetEmployers', 'companyName firstName lastName email');
        res.status(201).json(populatedJob || createdJob);
    }
    catch (error) {
        console.error('Error creating job:', error);
        res.status(400).json({ message: error.message || 'Invalid job data' });
    }
});
exports.createJob = createJob;
// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Employer/Admin
const updateJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { location, targetEmployers, sharedHrEmails, shareShortlistedCandidates } = req.body;
        if (location && !(0, locationHelper_1.isValidCity)(location)) {
            res.status(400).json({ message: 'Invalid location. Please select a valid city from the list.' });
            return;
        }
        let resolvedTargetEmployers = Array.isArray(targetEmployers) ? [...targetEmployers] : [];
        if (Array.isArray(sharedHrEmails) && sharedHrEmails.length > 0) {
            const hrUsers = yield User_1.default.find({
                email: { $in: sharedHrEmails.map((e) => new RegExp(`^${e.trim()}$`, 'i')) }
            }).select('_id');
            const hrUserIds = hrUsers.map(u => u._id.toString());
            for (const uid of hrUserIds) {
                if (!resolvedTargetEmployers.includes(uid)) {
                    resolvedTargetEmployers.push(uid);
                }
            }
        }
        const updatedJob = yield Job_1.default.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, req.body), { targetEmployers: resolvedTargetEmployers, sharedHrEmails: sharedHrEmails || [], shareShortlistedCandidates: shareShortlistedCandidates !== false }), { new: true }).populate('targetEmployers', 'companyName firstName lastName email');
        if (!updatedJob) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }
        // Sync target employers to candidates who applied to this job
        if (resolvedTargetEmployers.length > 0) {
            const applications = yield Application_1.default.find({ job: updatedJob._id }).select('candidate');
            const candidateIds = applications.map(a => a.candidate);
            if (candidateIds.length > 0) {
                yield User_1.default.updateMany({ _id: { $in: candidateIds } }, { $addToSet: { assignedEmployers: { $each: resolvedTargetEmployers } } });
            }
        }
        res.json(updatedJob);
    }
    catch (error) {
        console.error('Error updating job:', error);
        res.status(400).json({ message: 'Error updating job' });
    }
});
exports.updateJob = updateJob;
// @desc    Delete a job and its applications
// @route   DELETE /api/jobs/:id
// @access  Private/Employer/Admin
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job = yield Job_1.default.findById(req.params.id);
        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }
        yield Application_1.default.deleteMany({ job: req.params.id });
        yield Job_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Job and associated applications removed successfully' });
    }
    catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.deleteJob = deleteJob;
// @desc    Cleanup junk / test jobs (e.g. fdg, new, nj) and orphan applications
// @route   POST /api/jobs/cleanup-test-jobs
// @access  Private/Employer/Admin
const cleanupTestJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const junkRegex = /^(fdg|new|nj|test|demo|asdf|xyz)$/i;
        const junkJobs = yield Job_1.default.find({
            $or: [
                { title: { $regex: junkRegex } },
                { company: { $regex: junkRegex } }
            ]
        });
        const junkIds = junkJobs.map(j => j._id);
        if (junkIds.length > 0) {
            yield Application_1.default.deleteMany({ job: { $in: junkIds } });
            yield Job_1.default.deleteMany({ _id: { $in: junkIds } });
        }
        // Clean orphan applications where candidate or job is missing
        const allApps = yield Application_1.default.find({});
        let removedOrphans = 0;
        for (const app of allApps) {
            const candidateExists = yield User_1.default.exists({ _id: app.candidate });
            const jobExists = yield Job_1.default.exists({ _id: app.job });
            if (!candidateExists || !jobExists) {
                yield Application_1.default.findByIdAndDelete(app._id);
                removedOrphans++;
            }
        }
        res.json({
            message: 'Cleanup successful',
            deletedJobsCount: junkIds.length,
            deletedOrphanApplicationsCount: removedOrphans
        });
    }
    catch (error) {
        console.error('Error cleaning up test jobs:', error);
        res.status(500).json({ message: 'Server error during cleanup', error });
    }
});
exports.cleanupTestJobs = cleanupTestJobs;
// @desc    Calculate match score for a job and candidate
// @route   GET /api/jobs/:id/match/:userId
// @access  Private
const getJobMatchScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job = yield Job_1.default.findById(req.params.id);
        const user = yield User_1.default.findById(req.params.userId);
        if (!job || !user) {
            res.status(404).json({ message: 'Job or User not found' });
            return;
        }
        const matchScore = (0, matchAlgorithm_1.calculateMatchScore)(user, job);
        res.json({ matchScore });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getJobMatchScore = getJobMatchScore;
