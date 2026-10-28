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
exports.checkEmail = exports.deleteEmployee = exports.getEmployees = exports.createEmployee = exports.getEmployers = exports.cleanupDbAndFixResumes = exports.seed50Candidates = exports.getCandidateResume = exports.downloadCandidateResumesZip = exports.matchCandidatesFromExcel = exports.assignCandidatesToCompany = exports.getCandidates = exports.seedLiveCandidates = exports.seed10CandidatesController = exports.updateUserProfile = exports.getUserProfile = exports.registerUser = exports.authUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const Job_1 = __importDefault(require("../models/Job"));
const Application_1 = __importDefault(require("../models/Application"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    try {
        const trimmedEmail = (email || '').toLowerCase().trim();
        let user = yield User_1.default.findOne({
            email: { $regex: new RegExp(`^${trimmedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
        });
        // Guaranteed authentication for admin@fastcareers.in
        if (trimmedEmail === 'admin@fastcareers.in' && password === 'Admin@123') {
            if (!user) {
                user = yield User_1.default.create({
                    firstName: 'System',
                    lastName: 'Admin',
                    email: 'admin@fastcareers.in',
                    password: 'Admin@123',
                    role: 'admin',
                    profileCompleted: true
                });
            }
            else {
                if (user.role !== 'admin') {
                    user.role = 'admin';
                }
                user.password = 'Admin@123';
                yield user.save();
            }
            res.json({
                _id: user._id,
                firstName: user.firstName || 'System',
                lastName: user.lastName || 'Admin',
                email: user.email,
                role: 'admin',
                token: (0, generateToken_1.default)(user._id.toString(), user.email),
            });
            return;
        }
        if (user && (yield user.matchPassword(password))) {
            const emailLower = (user.email || '').toLowerCase();
            const isOwner = emailLower === 'divyayadav141203@gmail.com' || emailLower === 'divyanshyadav10270@gmail.com' || emailLower === 'admin@fastcareers.in';
            if (isOwner && user.role !== 'admin') {
                user.role = 'admin';
                yield user.save();
            }
            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                phone: user.phone || ((_a = user.personalDetails) === null || _a === void 0 ? void 0 : _a.phone) || '',
                resumeUrl: user.resumeUrl,
                linkedinUrl: user.linkedinUrl,
                profileCompleted: user.profileCompleted,
                personalDetails: user.personalDetails,
                caPortfolio: user.caPortfolio,
                qualifications: user.qualifications,
                experienceInfo: user.experienceInfo,
                token: (0, generateToken_1.default)(user._id.toString(), user.email),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.authUser = authUser;
const whatsappService_1 = require("../utils/whatsappService");
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { firstName, lastName, companyName, email, password, role, phone, currentCity, dateOfBirth, isFresherCA, resumeUrl, linkedinUrl, caFinal, caInter, experienceInfo, articleships, articleshipCompletionDate, natureOfWork, gmcsCompleted, industrialTrainee, listedCompanyWork, } = req.body;
    try {
        const trimmedEmail = (email || '').toLowerCase().trim();
        if (!trimmedEmail) {
            res.status(400).json({ message: 'Email address is required.' });
            return;
        }
        const userExists = yield User_1.default.findOne({ email: trimmedEmail });
        if (userExists) {
            res.status(400).json({
                message: `The email "${trimmedEmail}" is already registered. Please sign in or use another email address.`
            });
            return;
        }
        const user = yield User_1.default.create(Object.assign({ firstName: firstName === null || firstName === void 0 ? void 0 : firstName.trim(), lastName: lastName === null || lastName === void 0 ? void 0 : lastName.trim(), companyName: (companyName === null || companyName === void 0 ? void 0 : companyName.trim()) || (role === 'employer' ? (`${firstName || ''} ${lastName || ''}`.trim()) : ''), email: trimmedEmail, password, role: role || 'candidate', phone: phone || '', resumeUrl: resumeUrl || '', linkedinUrl: linkedinUrl || '', profileCompleted: false, personalDetails: {
                phone: phone || '',
                currentCity: currentCity || '',
                dateOfBirth: dateOfBirth || '',
            }, caPortfolio: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ isFresherCA: isFresherCA === true || isFresherCA === 'true' }, (caFinal ? { caFinal } : {})), (caInter ? { caInter } : {})), (articleships && Array.isArray(articleships) && articleships.length > 0 ? { articleships } : {})), (articleshipCompletionDate ? { articleshipCompletionDate } : {})), (natureOfWork ? { natureOfWork } : {})), (gmcsCompleted ? { gmcsCompleted } : {})), (industrialTrainee ? { industrialTrainee } : {})), (listedCompanyWork ? { listedCompanyWork } : {})) }, (experienceInfo ? { experienceInfo } : {})));
        if (user) {
            const candidatePhone = user.phone || ((_a = user.personalDetails) === null || _a === void 0 ? void 0 : _a.phone) || phone || '';
            if (candidatePhone) {
                (0, whatsappService_1.sendRegistrationWhatsApp)(candidatePhone, `${user.firstName || ''} ${user.lastName || ''}`.trim())
                    .catch(err => console.error('[WhatsApp Registration Trigger Error]:', err));
            }
            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                phone: user.phone,
                resumeUrl: user.resumeUrl,
                linkedinUrl: user.linkedinUrl,
                profileCompleted: user.profileCompleted,
                personalDetails: user.personalDetails,
                caPortfolio: user.caPortfolio,
                experienceInfo: user.experienceInfo,
                token: (0, generateToken_1.default)(user._id.toString(), user.email),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data provided.' });
        }
    }
    catch (error) {
        console.error('Registration Error:', error);
        if (error.code === 11000 || ((_b = error.message) === null || _b === void 0 ? void 0 : _b.includes('duplicate key'))) {
            res.status(400).json({
                message: 'This email address is already registered in the system. Please sign in to your account or enter a different email.'
            });
            return;
        }
        res.status(500).json({ message: error.message || 'Server error during registration. Please try again.' });
    }
});
exports.registerUser = registerUser;
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user.id || req.user._id).select('-password');
        if (user) {
            const emailLower = (user.email || '').toLowerCase();
            const firstLower = (user.firstName || '').toLowerCase();
            const isOwner = emailLower === 'divyayadav141203@gmail.com' || emailLower === 'divyanshyadav10270@gmail.com' || emailLower === 'admin@fastcareers.in';
            if (isOwner && user.role !== 'admin') {
                user.role = 'admin';
                yield user.save();
            }
            res.json(user);
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUserProfile = getUserProfile;
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!userId) {
            res.status(401).json({ message: 'Authentication required. Please log in again.' });
            return;
        }
        const user = yield User_1.default.findById(userId);
        if (user) {
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            user.email = req.body.email || user.email;
            if (req.body.resumeUrl !== undefined)
                user.resumeUrl = req.body.resumeUrl;
            if (req.body.headline !== undefined)
                user.headline = req.body.headline;
            if (req.body.skills !== undefined)
                user.skills = req.body.skills;
            if (req.body.phone !== undefined) {
                user.phone = req.body.phone;
            }
            if (req.body.password)
                user.password = req.body.password;
            if (req.body.personalDetails !== undefined) {
                user.personalDetails = Object.assign(Object.assign(Object.assign({}, (user.personalDetails || {})), req.body.personalDetails), { phone: ((_c = req.body.personalDetails) === null || _c === void 0 ? void 0 : _c.phone) || req.body.phone || user.phone || '' });
                if (((_d = user.personalDetails) === null || _d === void 0 ? void 0 : _d.phone) && !user.phone) {
                    user.phone = user.personalDetails.phone;
                }
            }
            if (req.body.caPortfolio !== undefined)
                user.caPortfolio = req.body.caPortfolio;
            if (req.body.qualifications !== undefined)
                user.qualifications = req.body.qualifications;
            if (req.body.experienceInfo !== undefined)
                user.experienceInfo = req.body.experienceInfo;
            if (req.body.profileCompleted !== undefined) {
                user.profileCompleted = req.body.profileCompleted;
            }
            else if (req.body.qualifications && (((_e = req.body.qualifications.graduation) === null || _e === void 0 ? void 0 : _e.completed) || ((_f = req.body.qualifications.graduation) === null || _f === void 0 ? void 0 : _f.courseName))) {
                user.profileCompleted = true;
            }
            const updatedUser = yield user.save();
            // Return the updated user object without password, plus token
            const userResponse = updatedUser.toObject();
            delete userResponse.password;
            res.json(Object.assign(Object.assign({}, userResponse), { token: (0, generateToken_1.default)(updatedUser._id.toString(), updatedUser.email) }));
        }
        else {
            res.status(404).json({ message: 'User not found. Please log in again.' });
        }
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        res.status(400).json({ message: error.message || 'Server error while saving profile' });
    }
});
exports.updateUserProfile = updateUserProfile;
const xlsx = __importStar(require("xlsx"));
const seed20Candidates_1 = require("../seed20Candidates");
const resumeGenerator_1 = require("../utils/resumeGenerator");
const archiver = require('archiver');
const sanitizeFilename = (name) => {
    return name.replace(/[/\\?%*:|"<>]/g, '').trim().replace(/\s+/g, '_');
};
const seed10AppliedCandidates_1 = require("../seed10AppliedCandidates");
// @desc    Seed 10 new candidate records with PDF resumes and job applications
// @route   GET /api/users/seed-10-candidates
// @access  Public / Admin
const seed10CandidatesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, seed10AppliedCandidates_1.seed10AppliedCandidates)(false);
        res.json({
            success: true,
            message: 'Successfully seeded 10 new candidate records with PDF resumes and submitted job applications!',
            data: result,
        });
    }
    catch (error) {
        console.error('Error in seed10CandidatesController:', error);
        res.status(500).json({ message: error.message || 'Error seeding 10 candidates' });
    }
});
exports.seed10CandidatesController = seed10CandidatesController;
// @desc    Seed 20 test candidates and resumes to the connected MongoDB database
// @route   GET /api/users/seed-test-candidates
// @access  Public / Admin
const seedLiveCandidates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, seed20Candidates_1.seed20)(false);
        res.json({
            success: true,
            message: 'Successfully seeded 20 realistic candidate records and generated PDF resumes in database!',
            data: result,
        });
    }
    catch (error) {
        console.error('Error in seedLiveCandidates:', error);
        res.status(500).json({ message: error.message || 'Error seeding candidates' });
    }
});
exports.seedLiveCandidates = seedLiveCandidates;
// @desc    Get all candidates
// @route   GET /api/users/candidates
// @access  Private/Admin or Employer (filtered by permission)
const getCandidates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        let query = { role: 'candidate' };
        let myJobIds = [];
        // If logged in as an Employer, ONLY return candidates explicitly assigned or associated with jobs shared with/posted by this employer
        if ((user === null || user === void 0 ? void 0 : user.role) === 'employer') {
            const myJobs = yield Job_1.default.find({
                $or: [
                    { postedBy: user._id },
                    { targetEmployers: user._id },
                    { sharedHrEmails: user.email }
                ]
            }).select('_id');
            myJobIds = myJobs.map((j) => j._id);
            const applicantCandidateIds = yield Application_1.default.distinct('candidate', { job: { $in: myJobIds } });
            query.$or = [
                { assignedEmployers: user._id },
                { _id: { $in: applicantCandidateIds } }
            ];
        }
        const candidates = yield User_1.default.find(query)
            .populate('assignedEmployers', 'companyName firstName lastName email')
            .sort({ createdAt: -1 })
            .select('-password');
        // Enrich candidates with application status for employer review
        const enrichedCandidates = yield Promise.all(candidates.map((c) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const plain = c.toObject();
            let app = null;
            if ((user === null || user === void 0 ? void 0 : user.role) === 'employer' && myJobIds.length > 0) {
                app = yield Application_1.default.findOne({ candidate: c._id, job: { $in: myJobIds } })
                    .populate('job', 'title company')
                    .sort({ updatedAt: -1 });
            }
            if (!app) {
                app = yield Application_1.default.findOne({ candidate: c._id })
                    .populate('job', 'title company')
                    .sort({ updatedAt: -1 });
                // For employers, if candidate was assigned by admin and has no application for employer's specific job,
                // default status MUST be 'applied' (Pending Review) because admin forwarded them, admin didn't shortlist on company's behalf
                if ((user === null || user === void 0 ? void 0 : user.role) === 'employer') {
                    plain.applicationId = app === null || app === void 0 ? void 0 : app._id;
                    plain.applicationStatus = 'applied'; // Default: Pending Review
                    plain.appliedJobTitle = ((_a = app === null || app === void 0 ? void 0 : app.job) === null || _a === void 0 ? void 0 : _a.title) || '';
                    return plain;
                }
            }
            if (app) {
                plain.applicationId = app._id;
                plain.applicationStatus = app.status || 'applied';
                plain.appliedJobTitle = ((_b = app.job) === null || _b === void 0 ? void 0 : _b.title) || '';
            }
            else {
                plain.applicationStatus = 'applied'; // Default: Pending Review
            }
            return plain;
        })));
        res.json(enrichedCandidates);
    }
    catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getCandidates = getCandidates;
const emailService_1 = require("../utils/emailService");
// @desc    Assign or unassign candidates to a company
// @route   PUT /api/users/candidates/assign-company
// @access  Private/Admin
const assignCandidatesToCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { candidateIds, employerId, action } = req.body;
        if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0 || !employerId) {
            res.status(400).json({ message: 'candidateIds array and employerId are required' });
            return;
        }
        if (action === 'unassign') {
            yield User_1.default.updateMany({ _id: { $in: candidateIds }, role: 'candidate' }, { $pull: { assignedEmployers: employerId } });
        }
        else {
            yield User_1.default.updateMany({ _id: { $in: candidateIds }, role: 'candidate' }, { $addToSet: { assignedEmployers: employerId } });
            // Trigger Email Notification to Company HR
            try {
                const employer = yield User_1.default.findById(employerId);
                if (employer && employer.email) {
                    const candidates = yield User_1.default.find({ _id: { $in: candidateIds } });
                    const formattedCandidates = candidates.map(c => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                        const qual = (((_b = (_a = c.caPortfolio) === null || _a === void 0 ? void 0 : _a.caFinal) === null || _b === void 0 ? void 0 : _b.group1Year) || ((_d = (_c = c.caPortfolio) === null || _c === void 0 ? void 0 : _c.caFinal) === null || _d === void 0 ? void 0 : _d.bothGroups1stAttempt))
                            ? 'CA Final'
                            : (((_f = (_e = c.caPortfolio) === null || _e === void 0 ? void 0 : _e.caInter) === null || _f === void 0 ? void 0 : _f.group1Year) || ((_h = (_g = c.caPortfolio) === null || _g === void 0 ? void 0 : _g.caInter) === null || _h === void 0 ? void 0 : _h.bothGroups1stAttempt))
                                ? 'CA Inter'
                                : 'Graduate Candidate';
                        return {
                            firstName: c.firstName,
                            lastName: c.lastName,
                            email: c.email,
                            phone: c.phone || ((_j = c.personalDetails) === null || _j === void 0 ? void 0 : _j.phone),
                            currentCity: (_k = c.personalDetails) === null || _k === void 0 ? void 0 : _k.currentCity,
                            caQualification: qual,
                            jobTitle: c.headline || 'Chartered Accountant Candidate',
                        };
                    });
                    const companyTitle = employer.companyName || `${employer.firstName || ''} ${employer.lastName || ''}`.trim() || 'Company';
                    (0, emailService_1.sendCandidateSharedEmail)(employer.email, employer.firstName || companyTitle, companyTitle, formattedCandidates);
                }
            }
            catch (emailErr) {
                console.error('Error sending email notification to HR:', emailErr);
            }
        }
        res.json({ message: `Successfully ${action === 'unassign' ? 'unassigned' : 'assigned'} candidates.` });
    }
    catch (error) {
        console.error('Error assigning candidates:', error);
        res.status(500).json({ message: 'Server error assigning candidates' });
    }
});
exports.assignCandidatesToCompany = assignCandidatesToCompany;
// @desc    Match candidates by uploaded Excel sheet containing emails
// @route   POST /api/users/candidates/match-excel
// @access  Private/Employer/Admin
const matchCandidatesFromExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let rawEmails = [];
        if (req.file && req.file.buffer) {
            // Parse Excel from uploaded file buffer
            let workbook;
            try {
                workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
            }
            catch (parseErr) {
                res.status(400).json({ message: 'Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file.' });
                return;
            }
            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                res.status(400).json({ message: 'Excel file is empty and contains no sheets.' });
                return;
            }
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = xlsx.utils.sheet_to_json(firstSheet, { defval: '' });
            if (rows.length === 0) {
                res.status(400).json({ message: 'The uploaded Excel sheet contains no data rows.' });
                return;
            }
            // Detect email column header case-insensitively
            const sampleRow = rows[0];
            const columnKeys = Object.keys(sampleRow);
            const emailKey = columnKeys.find(key => /^(candidate\s*)?e[-_]?mail(\s*address)?$/i.test(key.trim()) ||
                /email|e-mail/i.test(key.trim()));
            if (!emailKey) {
                res.status(400).json({
                    message: "Could not find an 'Email' column in the Excel file. Please ensure your sheet has a column header named 'Email'."
                });
                return;
            }
            for (const row of rows) {
                const val = row[emailKey];
                if (val && typeof val === 'string') {
                    rawEmails.push(val);
                }
                else if (val !== undefined && val !== null) {
                    rawEmails.push(String(val));
                }
            }
        }
        else if (req.body.emails && Array.isArray(req.body.emails)) {
            rawEmails = req.body.emails;
        }
        else {
            res.status(400).json({ message: 'Please upload an Excel file (.xlsx or .xls) with candidate emails.' });
            return;
        }
        // Normalize: trim, lowercase, validate email regex, deduplicate
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const normalizedEmailsSet = new Set();
        for (const item of rawEmails) {
            const clean = item.trim().toLowerCase();
            if (clean && emailRegex.test(clean)) {
                normalizedEmailsSet.add(clean);
            }
        }
        const uniqueEmails = Array.from(normalizedEmailsSet);
        if (uniqueEmails.length === 0) {
            res.status(400).json({
                message: 'No valid email addresses found in the uploaded Excel file. Please check the Email column format.'
            });
            return;
        }
        // Query database with case-insensitive regex for all candidates
        const regexQueries = uniqueEmails.map(email => new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'));
        const user = req.user;
        let excelCandidateQuery = {
            role: 'candidate',
            email: { $in: regexQueries },
        };
        if ((user === null || user === void 0 ? void 0 : user.role) === 'employer') {
            const myJobs = yield Job_1.default.find({
                $or: [
                    { postedBy: user._id },
                    { targetEmployers: user._id },
                    { sharedHrEmails: user.email }
                ]
            }).select('_id');
            const myJobIds = myJobs.map((j) => j._id);
            const applicantCandidateIds = yield Application_1.default.distinct('candidate', { job: { $in: myJobIds } });
            excelCandidateQuery.$or = [
                { assignedEmployers: user._id },
                { _id: { $in: applicantCandidateIds } }
            ];
        }
        const matchedCandidatesList = yield User_1.default.find(excelCandidateQuery).select('-password');
        // Calculate match statistics - all matched candidates have resumes (either uploaded or generated on-the-fly)
        const totalEmails = uniqueEmails.length;
        const matchedCandidates = matchedCandidatesList.length;
        const resumesAvailable = matchedCandidates;
        const resumesUnavailable = 0;
        const notFound = Math.max(0, totalEmails - matchedCandidates);
        // Format candidate data with hasResume indicator
        const enrichedCandidates = matchedCandidatesList.map(c => {
            const plain = c.toObject();
            return Object.assign(Object.assign({}, plain), { hasResume: true });
        });
        res.json({
            success: true,
            totalEmails,
            matchedCandidates,
            resumesAvailable,
            resumesUnavailable,
            notFound,
            candidates: enrichedCandidates,
        });
    }
    catch (error) {
        console.error('Error in matchCandidatesFromExcel:', error);
        res.status(500).json({ message: error.message || 'Server error while matching candidates from Excel.' });
    }
});
exports.matchCandidatesFromExcel = matchCandidatesFromExcel;
// @desc    Download PDF resumes of selected candidates in a single ZIP file
// @route   POST /api/users/candidates/download-resumes-zip
// @access  Private/Employer/Admin
const downloadCandidateResumesZip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { candidateIds } = req.body;
        if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
            res.status(400).json({ message: 'No candidates selected for resume download.' });
            return;
        }
        const user = req.user;
        let zipCandidateQuery = {
            _id: { $in: candidateIds },
            role: 'candidate',
        };
        if ((user === null || user === void 0 ? void 0 : user.role) === 'employer') {
            const myJobs = yield Job_1.default.find({
                $or: [
                    { postedBy: user._id },
                    { targetEmployers: user._id },
                    { sharedHrEmails: user.email }
                ]
            }).select('_id');
            const myJobIds = myJobs.map((j) => j._id);
            const applicantCandidateIds = yield Application_1.default.distinct('candidate', { job: { $in: myJobIds } });
            zipCandidateQuery.$or = [
                { assignedEmployers: user._id },
                { _id: { $in: applicantCandidateIds } }
            ];
        }
        // Verify candidates from database
        const candidates = yield User_1.default.find(zipCandidateQuery).select('-password');
        if (candidates.length === 0) {
            res.status(400).json({ message: 'No valid candidates found for the selected IDs.' });
            return;
        }
        // Set headers for ZIP file download
        const zipFilename = `FAST_Careers_Resumes_${new Date().toISOString().split('T')[0]}.zip`;
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);
        const archive = typeof archiver === 'function'
            ? archiver('zip', { zlib: { level: 6 } })
            : new (archiver.ZipArchive || archiver.Archiver)({ zlib: { level: 6 } });
        archive.on('error', (err) => {
            console.error('Archiver error:', err);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error generating ZIP file.' });
            }
        });
        archive.pipe(res);
        // Track duplicate filenames to ensure unique names in the ZIP
        const nameTracker = new Map();
        for (const candidate of candidates) {
            const fName = sanitizeFilename(candidate.firstName || 'Candidate');
            const lName = sanitizeFilename(candidate.lastName || '');
            let baseName = `${fName}${lName ? '_' + lName : ''}`;
            if (!baseName || baseName === '_') {
                baseName = `Candidate_${candidate._id.toString().slice(-6)}`;
            }
            let filename = '';
            if (!nameTracker.has(baseName)) {
                nameTracker.set(baseName, 1);
                filename = `${baseName}.pdf`;
            }
            else {
                const count = (nameTracker.get(baseName) || 1) + 1;
                nameTracker.set(baseName, count);
                filename = `${baseName}_${count}.pdf`;
            }
            let buffer = null;
            try {
                buffer = yield (0, resumeGenerator_1.fetchOrGenerateResumeBuffer)(candidate.resumeUrl, candidate);
            }
            catch (bufErr) {
                console.error(`Error retrieving resume buffer for ${candidate.firstName}:`, bufErr);
                buffer = yield (0, resumeGenerator_1.generateCandidatePdfBuffer)(candidate);
            }
            if (buffer) {
                archive.append(buffer, { name: filename });
            }
        }
        yield archive.finalize();
    }
    catch (error) {
        console.error('Error in downloadCandidateResumesZip:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: error.message || 'Server error while generating ZIP.' });
        }
    }
});
exports.downloadCandidateResumesZip = downloadCandidateResumesZip;
// @desc    Download / view single candidate PDF resume (from disk, remote or generated dynamically)
// @route   GET /api/users/candidates/:id/resume
// @access  Public
const getCandidateResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : (rawId || '');
        let candidate = null;
        if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
            candidate = yield User_1.default.findById(id);
        }
        else if (id) {
            candidate = yield (0, resumeGenerator_1.findCandidateByFilename)(id);
        }
        if (!candidate) {
            res.status(404).json({ message: 'Candidate not found' });
            return;
        }
        const buffer = yield (0, resumeGenerator_1.fetchOrGenerateResumeBuffer)(candidate.resumeUrl, candidate);
        if (!buffer) {
            res.status(404).json({ message: 'Could not generate or retrieve resume for this candidate.' });
            return;
        }
        const fName = sanitizeFilename(candidate.firstName || 'Candidate');
        const lName = sanitizeFilename(candidate.lastName || '');
        const filename = `${fName}${lName ? '_' + lName : ''}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        res.end(buffer);
    }
    catch (error) {
        console.error('Error serving candidate resume:', error);
        res.status(500).json({ message: 'Error serving candidate resume' });
    }
});
exports.getCandidateResume = getCandidateResume;
// First names, Last names, Cities
const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Diya", "Sanya", "Myra", "Anya", "Kiara", "Kriti", "Ananya", "Riya", "Rohan", "Kabir", "Neha", "Pooja", "Rahul", "Karan", "Simran", "Raj", "Nisha", "Vikram", "Sneha", "Rishi", "Tara", "Amit", "Alia", "Varun", "Shruti", "Siddharth", "Tanvi", "Nikhil", "Priya", "Manish", "Divya", "Gaurav", "Isha", "Kunal", "Megha", "Prateek", "Sakshi", "Tarun", "Vidhi", "Yash"];
const lastNames = ["Sharma", "Verma", "Gupta", "Malhotra", "Singh", "Patel", "Joshi", "Deshmukh", "Reddy", "Iyer", "Chauhan", "Agarwal", "Bansal", "Mehta", "Trivedi", "Nair", "Menon", "Kapoor", "Chopra", "Das"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"];
const states = ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Gujarat", "Tamil Nadu", "West Bengal", "Gujarat", "Maharashtra", "Rajasthan", "Uttar Pradesh", "Uttar Pradesh", "Maharashtra", "Madhya Pradesh", "Maharashtra"];
const companies = ["Deloitte", "KPMG", "EY", "PwC", "Grant Thornton", "BDO", "Tata Motors", "Reliance", "HDFC Bank", "Infosys"];
const seed50Candidates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash("123456", salt);
        const candidates = [];
        for (let i = 0; i < 50; i++) {
            const isExperienced = i < 10;
            const fName = firstNames[i % firstNames.length];
            const lName = lastNames[i % lastNames.length];
            const cityIdx = Math.floor(Math.random() * cities.length);
            const randomCity = cities[cityIdx];
            const randomState = states[cityIdx];
            const randomCompany = companies[Math.floor(Math.random() * companies.length)];
            candidates.push({
                firstName: fName,
                lastName: lName,
                email: `${fName.toLowerCase()}.${lName.toLowerCase()}_${Date.now()}@example.com`,
                password: hashedPassword,
                role: "candidate",
                phone: `9${Math.floor(Math.random() * 900000000) + 100000000}`,
                headline: isExperienced ? "Experienced Chartered Accountant" : "Motivated Fresher CA",
                resumeUrl: "", // Empty URL forces the system to dynamically generate a REAL-looking PDF with their data!
                skills: ["Accounting", "Taxation", "Audit", "Financial Modeling", "GST", "Income Tax"].sort(() => 0.5 - Math.random()).slice(0, 4),
                experience: isExperienced ? Math.floor(Math.random() * 5) + 1 : 0,
                personalDetails: {
                    alternatePhone: `8${Math.floor(Math.random() * 900000000) + 100000000}`,
                    currentAddress: `${Math.floor(Math.random() * 100) + 1}, Civil Lines`,
                    currentState: randomState,
                    currentCity: randomCity,
                    permanentAddressSameAsCurrent: true,
                    dateOfBirth: `199${Math.floor(Math.random() * 8) + 1}-05-15`,
                    gender: i % 2 === 0 ? "Female" : "Male",
                    maritalStatus: "Unmarried",
                    preferredCampusCity: ["Mumbai", "Delhi", "Pune", "Bangalore"][Math.floor(Math.random() * 4)]
                },
                caPortfolio: {
                    isFresherCA: !isExperienced,
                    caInter: {
                        bothGroups1stAttempt: Math.random() > 0.5,
                        group1Attempts: String(Math.floor(Math.random() * 3) + 1),
                        group1Month: "May",
                        group1Year: "2018",
                        group2Attempts: String(Math.floor(Math.random() * 3) + 1),
                        group2Month: "Nov",
                        group2Year: "2018",
                        ranker: Math.random() > 0.8 ? "Yes" : "No",
                        completionSessionMonth: "Nov",
                        completionSessionYear: "2018",
                        percentage: String(Math.floor(Math.random() * 15) + 55)
                    },
                    caFinal: {
                        bothGroups1stAttempt: Math.random() > 0.7,
                        group1Attempts: String(Math.floor(Math.random() * 4) + 1),
                        group1Month: "May",
                        group1Year: "2021",
                        group2Attempts: String(Math.floor(Math.random() * 4) + 1),
                        group2Month: "Nov",
                        group2Year: "2021",
                        ranker: Math.random() > 0.9 ? "Yes" : "No",
                        completionSessionMonth: "Nov",
                        completionSessionYear: "2021",
                        percentage: String(Math.floor(Math.random() * 15) + 50)
                    },
                    articleships: [{
                            type: "Statutory Audit",
                            firmType: ["Big4", "Medium", "Small"][Math.floor(Math.random() * 3)],
                            firmName: `${lastNames[Math.floor(Math.random() * lastNames.length)]} & Associates`,
                            city: randomCity,
                            noOfPartners: String(Math.floor(Math.random() * 10) + 2),
                            noOfMonths: "36"
                        }],
                    articleshipCompletionDate: "2021-04-30",
                    gmcsCompleted: "Yes",
                    big4Articleship: Math.random() > 0.8 ? "Yes" : "No",
                    industrialTrainee: Math.random() > 0.9 ? "Yes" : "No",
                    listedCompanyWork: Math.random() > 0.6 ? "Yes" : "No",
                    natureOfWork: "Audit & Taxation"
                },
                qualifications: {
                    graduation: {
                        completed: "Yes",
                        yearOfCompletion: "2017",
                        percentage: String(Math.floor(Math.random() * 20) + 60),
                        college: "Local University",
                        type: "REGULAR"
                    },
                    class12: { percentage: String(Math.floor(Math.random() * 20) + 70), year: "2014", board: "CBSE" },
                    class10: { percentage: String(Math.floor(Math.random() * 15) + 80), year: "2012", board: "CBSE" }
                },
                experienceInfo: isExperienced ? {
                    isExperienced: true,
                    experienceYears: String(Math.floor(Math.random() * 5) + 1),
                    currentCompanyName: randomCompany,
                    currentCTC: String((Math.floor(Math.random() * 5) + 8) * 100000),
                    expectedCTC: String((Math.floor(Math.random() * 5) + 12) * 100000),
                    currentDesignation: "Chartered Accountant",
                    workProfile: "Financial Reporting"
                } : undefined
            });
        }
        yield User_1.default.insertMany(candidates);
        res.json({ success: true, message: "Successfully added 50 realistic candidates!" });
    }
    catch (error) {
        console.error("Error in seed50Candidates:", error);
        res.status(500).json({ message: error.message || "Error seeding 50 candidates" });
    }
});
exports.seed50Candidates = seed50Candidates;
const cleanupDbAndFixResumes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Only delete dummy test candidates specifically with @example.com
        const deleteResult = yield User_1.default.deleteMany({ email: { $regex: /@example\.com$/i } });
        res.json({
            success: true,
            message: "Test candidates cleanup complete. Real candidates are safe.",
            deletedCount: deleteResult.deletedCount
        });
    }
    catch (error) {
        console.error("Error cleaning up DB:", error);
        res.status(500).json({ message: error.message || "Error cleaning up DB" });
    }
});
exports.cleanupDbAndFixResumes = cleanupDbAndFixResumes;
const getEmployers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employers = yield User_1.default.find({
            $or: [
                { role: { $regex: /^employer$/i } },
                { role: { $regex: /^company$/i } },
                { companyName: { $exists: true, $ne: '' } }
            ]
        }).select('-password').sort({ companyName: 1, firstName: 1 });
        const formattedEmployers = employers.map((emp) => {
            const plain = emp.toObject();
            if (!plain.companyName || plain.companyName.trim() === '') {
                const hrName = `${plain.firstName || ''} ${plain.lastName || ''}`.trim();
                plain.companyName = hrName ? hrName : (plain.email ? plain.email : 'Registered Company');
            }
            return plain;
        });
        res.json(formattedEmployers);
    }
    catch (error) {
        console.error('Error in getEmployers:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getEmployers = getEmployers;
// @desc    Register a new internal employee (Admin only)
// @route   POST /api/users/employees
// @access  Private/Admin
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, phone, designation } = req.body;
    try {
        const trimmedEmail = (email || '').toLowerCase().trim();
        if (!trimmedEmail || !password || !firstName) {
            res.status(400).json({ message: 'First name, email address, and password are required.' });
            return;
        }
        const userExists = yield User_1.default.findOne({ email: trimmedEmail });
        if (userExists) {
            res.status(400).json({ message: `The email "${trimmedEmail}" is already registered.` });
            return;
        }
        const employee = yield User_1.default.create({
            firstName: firstName.trim(),
            lastName: (lastName || '').trim(),
            email: trimmedEmail,
            password,
            role: 'employee',
            phone: phone || '',
            headline: designation || 'Staff Member',
            profileCompleted: true
        });
        res.status(201).json({
            _id: employee._id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            role: employee.role,
            phone: employee.phone,
            headline: employee.headline,
            createdAt: employee.createdAt
        });
    }
    catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({ message: error.message || 'Server error creating employee' });
    }
});
exports.createEmployee = createEmployee;
// @desc    Get all registered internal employees (Admin only)
// @route   GET /api/users/employees
// @access  Private/Admin
const getEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield User_1.default.find({ role: 'employee' }).select('-password').sort({ createdAt: -1 });
        res.json(employees);
    }
    catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Server Error fetching employees' });
    }
});
exports.getEmployees = getEmployees;
// @desc    Delete an internal employee (Admin only)
// @route   DELETE /api/users/employees/:id
// @access  Private/Admin
const deleteEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield User_1.default.findOneAndDelete({ _id: req.params.id, role: 'employee' });
        if (!employee) {
            res.status(404).json({ message: 'Employee account not found' });
            return;
        }
        res.json({ message: 'Employee account removed successfully' });
    }
    catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'Server error deleting employee' });
    }
});
exports.deleteEmployee = deleteEmployee;
// @desc    Check if email already exists
// @route   GET /api/users/check-email
// @access  Public
const checkEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = (req.query.email || '').toLowerCase().trim();
        if (!email) {
            res.json({ exists: false });
            return;
        }
        const userExists = yield User_1.default.findOne({ email });
        res.json({ exists: !!userExists });
    }
    catch (error) {
        res.status(500).json({ message: 'Error checking email' });
    }
});
exports.checkEmail = checkEmail;
