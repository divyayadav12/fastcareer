import { Request, Response } from 'express';
import User from '../models/User';
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
const archiver = require('archiver');

// Helper to fetch buffer of resume
const fetchResumeBuffer = async (url: string): Promise<Buffer | null> => {
  try {
    const cloudinaryPattern = 'https://res.cloudinary.com';
    let cleanUrl = url.trim();
    if (cleanUrl.includes(cloudinaryPattern)) {
      cleanUrl = cleanUrl.substring(cleanUrl.indexOf(cloudinaryPattern));
    }

    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      const response = await fetch(cleanUrl);
      if (!response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }

    // Local file path
    const normalizedPath = cleanUrl.replace(/^\/+/, '');
    const localFilePath = path.join(__dirname, '../../', normalizedPath);
    if (fs.existsSync(localFilePath)) {
      return fs.readFileSync(localFilePath);
    }
    return null;
  } catch (err) {
    console.error('Error fetching resume buffer:', err);
    return null;
  }
};

const sanitizeFilename = (name: string): string => {
  return name.replace(/[/\\?%*:|"<>]/g, '').trim().replace(/\s+/g, '_');
};

// @desc    Get all candidates
// @route   GET /api/users/candidates
// @access  Private/Admin
export const getCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await User.find({ role: 'candidate' }).select('-password');
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
    const regexQueries = uniqueEmails.map(email => new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'));

    const matchedCandidatesList = await User.find({
      role: 'candidate',
      email: { $in: regexQueries },
    }).select('-password');

    // Calculate match statistics
    const totalEmails = uniqueEmails.length;
    const matchedCandidates = matchedCandidatesList.length;
    const resumesAvailable = matchedCandidatesList.filter(c => !!c.resumeUrl && c.resumeUrl.trim().length > 0).length;
    const resumesUnavailable = matchedCandidates - resumesAvailable;
    const notFound = Math.max(0, totalEmails - matchedCandidates);

    // Format candidate data with hasResume indicator
    const enrichedCandidates = matchedCandidatesList.map(c => {
      const plain = c.toObject();
      return {
        ...plain,
        hasResume: !!(c.resumeUrl && c.resumeUrl.trim().length > 0)
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
    }).select('firstName lastName email resumeUrl');

    const candidatesWithResume = candidates.filter(c => !!c.resumeUrl && c.resumeUrl.trim().length > 0);

    if (candidatesWithResume.length === 0) {
      res.status(400).json({ message: 'None of the selected candidates have a valid resume file available.' });
      return;
    }

    // Set headers for ZIP file download
    const zipFilename = `FAST_Careers_Resumes_${new Date().toISOString().split('T')[0]}.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);

    const archive = archiver('zip', {
      zlib: { level: 6 },
    });

    archive.on('error', (err: any) => {
      console.error('Archiver error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error generating ZIP file.' });
      }
    });

    archive.pipe(res);

    // Track duplicate filenames to ensure unique names in the ZIP
    const nameTracker = new Map<string, number>();

    for (const candidate of candidatesWithResume) {
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

      const buffer = await fetchResumeBuffer(candidate.resumeUrl!);
      if (buffer) {
        archive.append(buffer, { name: filename });
      } else {
        archive.append(
          Buffer.from(`Could not fetch resume from ${candidate.resumeUrl}`),
          { name: `${baseName}_fetch_error.txt` }
        );
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
