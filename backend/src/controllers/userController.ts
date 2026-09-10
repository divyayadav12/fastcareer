import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'This email is already registered. Please use a different email address.' });
      return;
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'candidate',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      
      if (req.body.resumeUrl !== undefined) user.resumeUrl = req.body.resumeUrl;
      if (req.body.headline !== undefined) user.headline = req.body.headline;
      if (req.body.skills !== undefined) user.skills = req.body.skills;
      if (req.body.phone !== undefined) user.phone = req.body.phone;
      if (req.body.password) user.password = req.body.password;
      
      if (req.body.personalDetails !== undefined) user.personalDetails = req.body.personalDetails;
      if (req.body.caPortfolio !== undefined) user.caPortfolio = req.body.caPortfolio;
      if (req.body.qualifications !== undefined) user.qualifications = req.body.qualifications;
      if (req.body.experienceInfo !== undefined) user.experienceInfo = req.body.experienceInfo;

      const updatedUser = await user.save();

      // Return the updated user object without password, plus token
      const userResponse = updatedUser.toObject();
      delete userResponse.password;
      
      res.json({
        ...userResponse,
        token: generateToken(updatedUser._id.toString()),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

import path from 'path';
import fs from 'fs';
import * as xlsx from 'xlsx';
import { seed20 } from '../seed20Candidates';
import { 
  generateCandidatePdfBuffer, 
  fetchOrGenerateResumeBuffer, 
  findCandidateByFilename 
} from '../utils/resumeGenerator';
const archiver = require('archiver');

const sanitizeFilename = (name: string): string => {
  return name.replace(/[/\\?%*:|"<>]/g, '').trim().replace(/\s+/g, '_');
};

// @desc    Seed 20 test candidates and resumes to the connected MongoDB database
// @route   GET /api/users/seed-test-candidates
// @access  Public / Admin
export const seedLiveCandidates = async (req: Request, res: Response) => {
  try {
    const result = await seed20(false);
    res.json({
      success: true,
      message: 'Successfully seeded 20 realistic candidate records and generated PDF resumes in database!',
      data: result,
    });
  } catch (error: any) {
    console.error('Error in seedLiveCandidates:', error);
    res.status(500).json({ message: error.message || 'Error seeding candidates' });
  }
};


// @desc    Get all candidates
// @route   GET /api/users/candidates
// @access  Private/Admin
export const getCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await User.find({ role: 'candidate', resumeUrl: { $ne: "" }, $and: [{ resumeUrl: { $ne: null } }] }).select('-password');
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Match candidates by uploaded Excel sheet containing emails
// @route   POST /api/users/candidates/match-excel
// @access  Private/Employer/Admin
export const matchCandidatesFromExcel = async (req: Request, res: Response) => {
  try {
    let rawEmails: string[] = [];

    if (req.file && req.file.buffer) {
      // Parse Excel from uploaded file buffer
      let workbook: xlsx.WorkBook;
      try {
        workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      } catch (parseErr) {
        res.status(400).json({ message: 'Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file.' });
        return;
      }

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        res.status(400).json({ message: 'Excel file is empty and contains no sheets.' });
        return;
      }

      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = xlsx.utils.sheet_to_json<Record<string, any>>(firstSheet, { defval: '' });

      if (rows.length === 0) {
        res.status(400).json({ message: 'The uploaded Excel sheet contains no data rows.' });
        return;
      }

      // Detect email column header case-insensitively
      const sampleRow = rows[0];
      const columnKeys = Object.keys(sampleRow);
      
      const emailKey = columnKeys.find(key => 
        /^(candidate\s*)?e[-_]?mail(\s*address)?$/i.test(key.trim()) ||
        /email|e-mail/i.test(key.trim())
      );

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
        } else if (val !== undefined && val !== null) {
          rawEmails.push(String(val));
        }
      }
    } else if (req.body.emails && Array.isArray(req.body.emails)) {
      rawEmails = req.body.emails;
    } else {
      res.status(400).json({ message: 'Please upload an Excel file (.xlsx or .xls) with candidate emails.' });
      return;
    }

    // Normalize: trim, lowercase, validate email regex, deduplicate
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmailsSet = new Set<string>();

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
    const regexQueries = uniqueEmails.map(email => new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\$&')}$`, 'i'));

    const matchedCandidatesList = await User.find({
      role: 'candidate',
      email: { $in: regexQueries },
    }).select('-password');

    // Calculate match statistics - all matched candidates have resumes (either uploaded or generated on-the-fly)
    const totalEmails = uniqueEmails.length;
    const matchedCandidates = matchedCandidatesList.length;
    const resumesAvailable = matchedCandidates;
    const resumesUnavailable = 0;
    const notFound = Math.max(0, totalEmails - matchedCandidates);

    // Format candidate data with hasResume indicator
    const enrichedCandidates = matchedCandidatesList.map(c => {
      const plain = c.toObject();
      return {
        ...plain,
        hasResume: true
      };
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
  } catch (error: any) {
    console.error('Error in matchCandidatesFromExcel:', error);
    res.status(500).json({ message: error.message || 'Server error while matching candidates from Excel.' });
  }
};

// @desc    Download PDF resumes of selected candidates in a single ZIP file
// @route   POST /api/users/candidates/download-resumes-zip
// @access  Private/Employer/Admin
export const downloadCandidateResumesZip = async (req: Request, res: Response) => {
  try {
    const { candidateIds } = req.body;

    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      res.status(400).json({ message: 'No candidates selected for resume download.' });
      return;
    }

    // Verify candidates from database
    const candidates = await User.find({
      _id: { $in: candidateIds },
      role: 'candidate',
    }).select('-password');

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

    archive.on('error', (err: any) => {
      console.error('Archiver error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error generating ZIP file.' });
      }
    });

    archive.pipe(res);

    // Track duplicate filenames to ensure unique names in the ZIP
    const nameTracker = new Map<string, number>();

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
      } else {
        const count = (nameTracker.get(baseName) || 1) + 1;
        nameTracker.set(baseName, count);
        filename = `${baseName}_${count}.pdf`;
      }

      let buffer: Buffer | null = null;
      try {
        buffer = await fetchOrGenerateResumeBuffer(candidate.resumeUrl, candidate);
      } catch (bufErr) {
        console.error(`Error retrieving resume buffer for ${candidate.firstName}:`, bufErr);
        buffer = await generateCandidatePdfBuffer(candidate);
      }

      if (buffer) {
        archive.append(buffer, { name: filename });
      }
    }

    await archive.finalize();
  } catch (error: any) {
    console.error('Error in downloadCandidateResumesZip:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message || 'Server error while generating ZIP.' });
    }
  }
};

// @desc    Download / view single candidate PDF resume (from disk, remote or generated dynamically)
// @route   GET /api/users/candidates/:id/resume
// @access  Public
export const getCandidateResume = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : (rawId || '');
    let candidate = null;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      candidate = await User.findById(id);
    } else if (id) {
      candidate = await findCandidateByFilename(id);
    }

    if (!candidate) {
      res.status(404).json({ message: 'Candidate not found' });
      return;
    }

    const buffer = await fetchOrGenerateResumeBuffer(candidate.resumeUrl, candidate);
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
  } catch (error: any) {
    console.error('Error serving candidate resume:', error);
    res.status(500).json({ message: 'Error serving candidate resume' });
  }
};


// First names, Last names, Cities
const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Diya", "Sanya", "Myra", "Anya", "Kiara", "Kriti", "Ananya", "Riya", "Rohan", "Kabir", "Neha", "Pooja", "Rahul", "Karan", "Simran", "Raj", "Nisha", "Vikram", "Sneha", "Rishi", "Tara", "Amit", "Alia", "Varun", "Shruti", "Siddharth", "Tanvi", "Nikhil", "Priya", "Manish", "Divya", "Gaurav", "Isha", "Kunal", "Megha", "Prateek", "Sakshi", "Tarun", "Vidhi", "Yash"];
const lastNames = ["Sharma", "Verma", "Gupta", "Malhotra", "Singh", "Patel", "Joshi", "Deshmukh", "Reddy", "Iyer", "Chauhan", "Agarwal", "Bansal", "Mehta", "Trivedi", "Nair", "Menon", "Kapoor", "Chopra", "Das"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"];
const states = ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Gujarat", "Tamil Nadu", "West Bengal", "Gujarat", "Maharashtra", "Rajasthan", "Uttar Pradesh", "Uttar Pradesh", "Maharashtra", "Madhya Pradesh", "Maharashtra"];
const companies = ["Deloitte", "KPMG", "EY", "PwC", "Grant Thornton", "BDO", "Tata Motors", "Reliance", "HDFC Bank", "Infosys"];

export const seed50Candidates = async (req: Request, res: Response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);
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

    await User.insertMany(candidates);
    res.json({ success: true, message: "Successfully added 50 realistic candidates!" });
  } catch (error: any) {
    console.error("Error in seed50Candidates:", error);
    res.status(500).json({ message: error.message || "Error seeding 50 candidates" });
  }
};

export const cleanupDbAndFixResumes = async (req: Request, res: Response) => {
  try {
    // Delete ALL dummy candidates (both old 'TestCandidate' and new realistic ones)
    // We identify them because their emails end in '@example.com'
    const deleteResult = await User.deleteMany({ email: { $regex: /@example\.com$/i } });
    const incompleteDeleteResult = await User.deleteMany({ role: 'candidate', $or: [{ resumeUrl: null }, { resumeUrl: "" }] });

    res.json({
      success: true,
      message: "Saara test data (dummy candidates) successfully delete ho gaya hai!",
      deletedCount: deleteResult.deletedCount
    });
  } catch (error: any) {
    console.error("Error cleaning up DB:", error);
    res.status(500).json({ message: error.message || "Error cleaning up DB" });
  }
};