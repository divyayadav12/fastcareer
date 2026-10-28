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
exports.bulkUpdateApplicationStatus = exports.updateCompanyStatus = exports.updateCandidateStatus = exports.shareApplications = exports.getCandidateApplications = exports.getAllApplications = exports.getEmployerApplications = exports.deleteApplication = exports.updateApplicationStatus = exports.getJobApplications = exports.applyForJob = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Application_1 = __importDefault(require("../models/Application"));
const Job_1 = __importDefault(require("../models/Job"));
const User_1 = __importDefault(require("../models/User"));
const whatsappService_1 = require("../utils/whatsappService");
// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate)
const applyForJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { jobId } = req.params;
    const { coverLetter, existingResumeUrl } = req.body;
    try {
        if (!jobId || jobId === 'undefined' || !mongoose_1.default.Types.ObjectId.isValid(jobId)) {
            res.status(400).json({ message: 'Invalid Job ID or job not found' });
            return;
        }
        const candidateId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const candidateUser = yield User_1.default.findById(candidateId);
        let resumeUrl = req.file ? req.file.path : (existingResumeUrl || (candidateUser === null || candidateUser === void 0 ? void 0 : candidateUser.resumeUrl));
        if (!resumeUrl) {
            resumeUrl = 'uploads/default_resume.pdf';
        }
        const job = yield Job_1.default.findById(jobId);
        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }
        // Check if user already applied
        const existingApplication = yield Application_1.default.findOne({ job: jobId, candidate: candidateId });
        if (existingApplication) {
            res.status(400).json({ message: 'You have already applied for this job' });
            return;
        }
        // Auto-share if job has target employers or shared HR emails
        const hasTargetEmployers = Boolean((job.targetEmployers && job.targetEmployers.length > 0) ||
            (job.sharedHrEmails && job.sharedHrEmails.length > 0));
        const application = yield Application_1.default.create({
            job: new mongoose_1.default.Types.ObjectId(jobId),
            candidate: new mongoose_1.default.Types.ObjectId(candidateId),
            resumeUrl,
            coverLetter: coverLetter || '',
            status: 'applied',
            sharedWithEmployer: hasTargetEmployers ? true : false,
        });
        // Auto-assign candidate to target employers of this job so target HRs see applicant details
        if (job.targetEmployers && job.targetEmployers.length > 0) {
            yield User_1.default.findByIdAndUpdate(candidateId, {
                $addToSet: { assignedEmployers: { $each: job.targetEmployers } }
            });
        }
        if (job.sharedHrEmails && job.sharedHrEmails.length > 0) {
            const matchingEmployers = yield User_1.default.find({
                email: { $in: job.sharedHrEmails.map((e) => new RegExp(`^${e.trim()}$`, 'i')) }
            }).select('_id');
            if (matchingEmployers.length > 0) {
                const empIds = matchingEmployers.map(e => e._id);
                yield User_1.default.findByIdAndUpdate(candidateId, {
                    $addToSet: { assignedEmployers: { $each: empIds } }
                });
            }
        }
        // If a new resume was uploaded, update the candidate's profile
        if (req.file) {
            yield User_1.default.findByIdAndUpdate(candidateId, { resumeUrl: req.file.path });
        }
        res.status(201).json(application);
    }
    catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.applyForJob = applyForJob;
// @desc    Get applications for a job (Employer)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
const getJobApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield Application_1.default.find({ job: req.params.jobId })
            .populate('candidate', 'firstName lastName email headline');
        res.json(applications);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getJobApplications = getJobApplications;
// @desc    Update application status (Employer)
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
const updateApplicationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { status } = req.body;
    try {
        const application = yield Application_1.default.findById(req.params.id)
            .populate('candidate', 'firstName personalDetails email')
            .populate('job', 'title');
        if (application) {
            application.status = status;
            const updatedApplication = yield application.save();
            // Trigger WhatsApp & Email Notification for Shortlist/Selection
            if (status === 'shortlisted' || status === 'accepted') {
                const candidate = application.candidate;
                const job = application.job;
                if (((_a = candidate === null || candidate === void 0 ? void 0 : candidate.personalDetails) === null || _a === void 0 ? void 0 : _a.phone) || (candidate === null || candidate === void 0 ? void 0 : candidate.phone)) {
                    (0, whatsappService_1.sendShortlistedWhatsApp)(((_b = candidate.personalDetails) === null || _b === void 0 ? void 0 : _b.phone) || candidate.phone, candidate.firstName || 'Candidate', (job === null || job === void 0 ? void 0 : job.title) || 'a role');
                }
                // Notify assigned HRs by Email
                try {
                    const fullCandidate = yield User_1.default.findById(candidate._id || candidate);
                    if (fullCandidate && fullCandidate.assignedEmployers && fullCandidate.assignedEmployers.length > 0) {
                        for (const empId of fullCandidate.assignedEmployers) {
                            const employer = yield User_1.default.findById(empId);
                            if (employer && employer.email) {
                                const companyTitle = employer.companyName || `${employer.firstName || ''} ${employer.lastName || ''}`.trim() || 'Company';
                                (0, emailService_1.sendCandidateSharedEmail)(employer.email, employer.firstName || companyTitle, companyTitle, [{
                                        firstName: fullCandidate.firstName,
                                        lastName: fullCandidate.lastName,
                                        email: fullCandidate.email,
                                        phone: fullCandidate.phone || ((_c = fullCandidate.personalDetails) === null || _c === void 0 ? void 0 : _c.phone),
                                        currentCity: (_d = fullCandidate.personalDetails) === null || _d === void 0 ? void 0 : _d.currentCity,
                                        caQualification: 'Shortlisted Candidate',
                                        jobTitle: (job === null || job === void 0 ? void 0 : job.title) || 'Applied Position'
                                    }]);
                            }
                        }
                    }
                }
                catch (emailErr) {
                    console.error('Error sending HR email notification on status update:', emailErr);
                }
            }
            res.json(updatedApplication);
        }
        else {
            res.status(404).json({ message: 'Application not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateApplicationStatus = updateApplicationStatus;
// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private (Employer or Admin)
const deleteApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const application = yield Application_1.default.findByIdAndDelete(req.params.id);
        if (!application) {
            res.status(404).json({ message: 'Application not found' });
            return;
        }
        res.json({ message: 'Application deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.deleteApplication = deleteApplication;
// @desc    Get all applications for employer's jobs or admin overview
// @route   GET /api/applications/employer
// @access  Private (Employer or Admin)
const getEmployerApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Automatically cleanup any junk test jobs (fdg, new, nj, test)
        try {
            const junkRegex = /^(fdg|new|nj|test|demo|asdf|xyz)$/i;
            const junkJobs = yield Job_1.default.find({
                $or: [
                    { title: { $regex: junkRegex } },
                    { company: { $regex: junkRegex } }
                ]
            });
            if (junkJobs.length > 0) {
                const junkIds = junkJobs.map(j => j._id);
                yield Application_1.default.deleteMany({ job: { $in: junkIds } });
                yield Job_1.default.deleteMany({ _id: { $in: junkIds } });
            }
        }
        catch (cleanErr) {
            console.error('Error auto-cleaning junk jobs:', cleanErr);
        }
        const user = req.user;
        let query = {};
        if ((user === null || user === void 0 ? void 0 : user.role) === 'admin') {
            // Admin has full platform visibility
            query = {};
        }
        else {
            // Employer: Check if employer posted specific jobs or was targeted in job creation
            const myJobs = yield Job_1.default.find({
                $or: [
                    { postedBy: user === null || user === void 0 ? void 0 : user._id },
                    { targetEmployers: user === null || user === void 0 ? void 0 : user._id },
                    { sharedHrEmails: user === null || user === void 0 ? void 0 : user.email }
                ]
            });
            const myJobIds = myJobs.map(j => j._id);
            const assignedCandidates = yield User_1.default.find({ role: 'candidate', assignedEmployers: user === null || user === void 0 ? void 0 : user._id }).select('_id');
            const candidateIds = assignedCandidates.map(c => c._id);
            const orConditions = [];
            if (myJobIds.length > 0) {
                orConditions.push({ job: { $in: myJobIds }, sharedWithEmployer: true });
            }
            if (candidateIds.length > 0) {
                orConditions.push({ candidate: { $in: candidateIds }, sharedWithEmployer: true });
            }
            if (orConditions.length > 0) {
                query = { $or: orConditions };
            }
            else {
                query = { _id: null }; // Unselected employer gets zero applications
            }
        }
        const applications = yield Application_1.default.find(query)
            .populate('candidate', 'firstName lastName email phone resumeUrl personalDetails qualifications caPortfolio experience skills')
            .populate('job', 'title company location type salaryRange salary')
            .sort({ createdAt: -1 });
        // Filter out orphan applications and delete them in the background
        const validApplications = [];
        for (const app of applications) {
            if (!app.candidate || !app.job) {
                Application_1.default.findByIdAndDelete(app._id).catch(() => { });
            }
            else {
                validApplications.push(app);
            }
        }
        res.json(validApplications);
    }
    catch (error) {
        console.error('Error fetching employer applications:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getEmployerApplications = getEmployerApplications;
const getAllApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield Application_1.default.find()
            .populate('job', 'title company location type salaryRange')
            .populate('candidate', 'firstName lastName email phone resumeUrl personalDetails')
            .sort({ createdAt: -1 });
        res.json(applications);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getAllApplications = getAllApplications;
const getCandidateApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        let candidateId = typeof req.params.id === 'string' ? req.params.id : '';
        if (!candidateId || candidateId === 'undefined' || candidateId === 'null' || !mongoose_1.default.Types.ObjectId.isValid(candidateId)) {
            candidateId = ((_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) || ((_c = req.user) === null || _c === void 0 ? void 0 : _c._id);
        }
        if (!candidateId) {
            res.status(400).json({ message: 'Candidate ID required' });
            return;
        }
        const applications = yield Application_1.default.find({ candidate: candidateId })
            .populate('job', 'title company location salary status salaryRange type')
            .sort({ createdAt: -1 });
        res.json(applications);
    }
    catch (error) {
        console.error('Error in getCandidateApplications:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getCandidateApplications = getCandidateApplications;
// @desc    Share applications with employer
// @route   PUT /api/applications/share
// @access  Private (Admin)
const emailService_1 = require("../utils/emailService");
const shareApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const { applicationIds } = req.body;
    if (!applicationIds || !Array.isArray(applicationIds)) {
        res.status(400).json({ message: 'applicationIds array is required' });
        return;
    }
    try {
        yield Application_1.default.updateMany({ _id: { $in: applicationIds } }, { $set: { sharedWithEmployer: true } });
        // Fetch shared applications with full candidate & job info to notify HR
        try {
            const sharedApps = yield Application_1.default.find({ _id: { $in: applicationIds } })
                .populate('candidate')
                .populate('job');
            // Group candidate info by assigned employer
            const employerCandidateMap = new Map();
            for (const app of sharedApps) {
                const candidate = app.candidate;
                const job = app.job;
                if (!candidate)
                    continue;
                const qual = (((_b = (_a = candidate.caPortfolio) === null || _a === void 0 ? void 0 : _a.caFinal) === null || _b === void 0 ? void 0 : _b.group1Year) || ((_d = (_c = candidate.caPortfolio) === null || _c === void 0 ? void 0 : _c.caFinal) === null || _d === void 0 ? void 0 : _d.bothGroups1stAttempt))
                    ? 'CA Final'
                    : (((_f = (_e = candidate.caPortfolio) === null || _e === void 0 ? void 0 : _e.caInter) === null || _f === void 0 ? void 0 : _f.group1Year) || ((_h = (_g = candidate.caPortfolio) === null || _g === void 0 ? void 0 : _g.caInter) === null || _h === void 0 ? void 0 : _h.bothGroups1stAttempt))
                        ? 'CA Inter'
                        : 'Graduate Candidate';
                const info = {
                    firstName: candidate.firstName,
                    lastName: candidate.lastName,
                    email: candidate.email,
                    phone: candidate.phone || ((_j = candidate.personalDetails) === null || _j === void 0 ? void 0 : _j.phone),
                    currentCity: (_k = candidate.personalDetails) === null || _k === void 0 ? void 0 : _k.currentCity,
                    caQualification: qual,
                    jobTitle: (job === null || job === void 0 ? void 0 : job.title) || candidate.headline || 'Shortlisted Role',
                };
                const assignedEmployersList = candidate.assignedEmployers || [];
                for (const empId of assignedEmployersList) {
                    const empStr = empId.toString();
                    if (!employerCandidateMap.has(empStr)) {
                        employerCandidateMap.set(empStr, []);
                    }
                    employerCandidateMap.get(empStr).push(info);
                }
            }
            // Send email to each employer
            for (const [empId, cList] of employerCandidateMap.entries()) {
                const employer = yield User_1.default.findById(empId);
                if (employer && employer.email) {
                    const companyTitle = employer.companyName || `${employer.firstName || ''} ${employer.lastName || ''}`.trim() || 'Company';
                    (0, emailService_1.sendCandidateSharedEmail)(employer.email, employer.firstName || companyTitle, companyTitle, cList);
                }
            }
        }
        catch (emailErr) {
            console.error('Error sending application share email notification:', emailErr);
        }
        res.json({ message: 'Applications successfully shared with employer' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.shareApplications = shareApplications;
// @desc    Update candidate application status (by application ID or candidate ID)
// @route   PUT /api/applications/candidate-status
// @access  Private (Employer/Admin)
const updateCandidateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { candidateId, applicationId, status } = req.body;
        const user = req.user;
        const validStatuses = ['applied', 'reviewing', 'shortlisted', 'interviewed', 'rejected', 'hired'];
        if (!status || !validStatuses.includes(status)) {
            res.status(400).json({ message: 'Invalid status value' });
            return;
        }
        let myJobIds = [];
        if ((user === null || user === void 0 ? void 0 : user.role) === 'employer') {
            const myJobs = yield Job_1.default.find({
                $or: [
                    { postedBy: user._id },
                    { targetEmployers: user._id },
                    { sharedHrEmails: user.email }
                ]
            }).select('_id');
            myJobIds = myJobs.map(j => j._id);
        }
        let application = null;
        if (applicationId && mongoose_1.default.Types.ObjectId.isValid(applicationId)) {
            application = yield Application_1.default.findById(applicationId);
        }
        if (!application && candidateId && mongoose_1.default.Types.ObjectId.isValid(candidateId)) {
            if (myJobIds.length > 0) {
                application = yield Application_1.default.findOne({ candidate: candidateId, job: { $in: myJobIds } }).sort({ createdAt: -1 });
            }
            if (!application) {
                application = yield Application_1.default.findOne({ candidate: candidateId }).sort({ createdAt: -1 });
            }
        }
        if (!application && candidateId && mongoose_1.default.Types.ObjectId.isValid(candidateId)) {
            let job = yield Job_1.default.findOne({ $or: [{ postedBy: user === null || user === void 0 ? void 0 : user._id }, { targetEmployers: user === null || user === void 0 ? void 0 : user._id }] });
            if (!job) {
                job = yield Job_1.default.findOne({});
            }
            if (job) {
                application = yield Application_1.default.create({
                    job: job._id,
                    candidate: candidateId,
                    resumeUrl: 'uploads/default_resume.pdf',
                    status: status,
                    sharedWithEmployer: true
                });
            }
        }
        if (application) {
            if ((user === null || user === void 0 ? void 0 : user.role) === 'employer' && myJobIds.length > 0 && !myJobIds.some(id => id.toString() === application.job.toString())) {
                application.job = myJobIds[0];
            }
            application.status = status;
            yield application.save();
            // Trigger WhatsApp Notification for Shortlist/Selection
            if (status === 'shortlisted' || status === 'hired') {
                const candidateObj = yield User_1.default.findById(application.candidate);
                const jobObj = yield Job_1.default.findById(application.job);
                if (((_a = candidateObj === null || candidateObj === void 0 ? void 0 : candidateObj.personalDetails) === null || _a === void 0 ? void 0 : _a.phone) || (candidateObj === null || candidateObj === void 0 ? void 0 : candidateObj.phone)) {
                    const phoneNum = ((_b = candidateObj.personalDetails) === null || _b === void 0 ? void 0 : _b.phone) || candidateObj.phone;
                    (0, whatsappService_1.sendShortlistedWhatsApp)(phoneNum, candidateObj.firstName || 'Candidate', (jobObj === null || jobObj === void 0 ? void 0 : jobObj.title) || 'CA Candidate Profile');
                }
            }
            res.json({ success: true, message: `Status updated to ${status}`, application });
        }
        else {
            res.status(404).json({ message: 'Candidate application record not found' });
        }
    }
    catch (error) {
        console.error('Error updating candidate status:', error);
        res.status(500).json({ message: 'Server error updating candidate status' });
    }
});
exports.updateCandidateStatus = updateCandidateStatus;
// @desc    Update company-specific status for an application
// @route   PUT /api/applications/company-status
// @access  Private (Employer/Admin)
const updateCompanyStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { candidateId, applicationId, companyStatus } = req.body;
        const validStatuses = [
            'Pending Review',
            'CV View',
            'CV Rejected',
            'Shortlisted for Round 1',
            'Shortlisted for Round 2',
            'Shortlisted for Round 3',
            'Selected',
            'Rejected'
        ];
        if (!companyStatus || !validStatuses.includes(companyStatus)) {
            res.status(400).json({ message: 'Invalid company status value' });
            return;
        }
        let application = null;
        if (applicationId && mongoose_1.default.Types.ObjectId.isValid(applicationId)) {
            application = yield Application_1.default.findById(applicationId);
        }
        if (!application && candidateId && mongoose_1.default.Types.ObjectId.isValid(candidateId)) {
            application = yield Application_1.default.findOne({ candidate: candidateId }).sort({ createdAt: -1 });
        }
        if (!application && candidateId && mongoose_1.default.Types.ObjectId.isValid(candidateId)) {
            const defaultJob = yield Job_1.default.findOne({});
            if (defaultJob) {
                application = yield Application_1.default.create({
                    job: defaultJob._id,
                    candidate: candidateId,
                    resumeUrl: 'uploads/default_resume.pdf',
                    status: 'shortlisted',
                    companyStatus: companyStatus,
                    sharedWithEmployer: true
                });
            }
        }
        if (application) {
            application.companyStatus = companyStatus;
            yield application.save();
            res.json({ success: true, message: `Company status updated to ${companyStatus}`, application });
        }
        else {
            res.status(404).json({ message: 'Candidate application record not found' });
        }
    }
    catch (error) {
        console.error('Error updating company status:', error);
        res.status(500).json({ message: 'Server error updating company status' });
    }
});
exports.updateCompanyStatus = updateCompanyStatus;
// @desc    Bulk update status or companyStatus for multiple applications at once
// @route   PUT /api/applications/bulk-status
// @access  Private (Employer/Admin)
const bulkUpdateApplicationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { applicationIds, status, companyStatus } = req.body;
        if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
            res.status(400).json({ message: 'applicationIds array is required' });
            return;
        }
        const updateFields = {};
        if (status)
            updateFields.status = status;
        if (companyStatus)
            updateFields.companyStatus = companyStatus;
        if (Object.keys(updateFields).length === 0) {
            res.status(400).json({ message: 'Either status or companyStatus must be provided' });
            return;
        }
        const result = yield Application_1.default.updateMany({ _id: { $in: applicationIds } }, { $set: updateFields });
        // If status is shortlisted, trigger WhatsApp notifications in background
        if (status === 'shortlisted' || status === 'hired') {
            try {
                const apps = yield Application_1.default.find({ _id: { $in: applicationIds } }).populate('candidate').populate('job');
                for (const app of apps) {
                    const candidate = app.candidate;
                    const job = app.job;
                    if (((_a = candidate === null || candidate === void 0 ? void 0 : candidate.personalDetails) === null || _a === void 0 ? void 0 : _a.phone) || (candidate === null || candidate === void 0 ? void 0 : candidate.phone)) {
                        (0, whatsappService_1.sendShortlistedWhatsApp)(((_b = candidate.personalDetails) === null || _b === void 0 ? void 0 : _b.phone) || candidate.phone, candidate.firstName || 'Candidate', (job === null || job === void 0 ? void 0 : job.title) || 'CA Candidate Profile');
                    }
                }
            }
            catch (notifyErr) {
                console.error('Error sending bulk shortlist notifications:', notifyErr);
            }
        }
        res.json({
            success: true,
            message: `Successfully updated status for ${result.modifiedCount || applicationIds.length} candidates!`,
            modifiedCount: result.modifiedCount
        });
    }
    catch (error) {
        console.error('Error in bulkUpdateApplicationStatus:', error);
        res.status(500).json({ message: 'Server error updating bulk status' });
    }
});
exports.bulkUpdateApplicationStatus = bulkUpdateApplicationStatus;
