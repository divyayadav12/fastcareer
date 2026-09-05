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
import PDFDocument from 'pdfkit';
import { seed20 } from '../seed20Candidates';
const archiver = require('archiver');

// Helper to generate a clean, professional PDF resume buffer from candidate profile data
const generateCandidatePdfBuffer = (c: any): Promise<Buffer> => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    const fullName = `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Candidate';

    // Header / Title
    doc.fillColor('#0f2b48').fontSize(22).font('Helvetica-Bold').text(fullName, { align: 'left' });
    if (c.headline) {
      doc.fillColor('#4b5563').fontSize(11).font('Helvetica').text(c.headline, { align: 'left' });
    }
    doc.moveDown(0.3);

    // Contact info bar
    const location = [c.personalDetails?.currentCity, c.personalDetails?.currentState].filter(Boolean).join(', ');
    const contactParts = [
      c.email ? `Email: ${c.email}` : null,
      c.phone ? `Phone: ${c.phone}` : null,
      location ? `Location: ${location}` : null,
    ].filter(Boolean);

    if (contactParts.length > 0) {
      doc.fontSize(9).fillColor('#6b7280').text(contactParts.join('  |  '));
    }
    doc.moveDown(0.6);

    // Divider
    doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.8);

    // Professional Summary
    doc.fillColor('#0f2b48').fontSize(12).font('Helvetica-Bold').text('PROFESSIONAL SUMMARY');
    doc.moveDown(0.3);
    const caType = c.caPortfolio?.isFresherCA ? 'Fresher Chartered Accountant' : 'Chartered Accountant';
    doc.fillColor('#374151').fontSize(10).font('Helvetica').text(
      `${fullName} is a dedicated ${caType} registered on FAST Careers with strong expertise in financial reporting, statutory compliances, and audit engagements.`
    );
    doc.moveDown(0.8);

    // Professional Qualifications / CA Portfolio
    if (c.caPortfolio) {
      doc.fillColor('#0f2b48').fontSize(12).font('Helvetica-Bold').text('PROFESSIONAL QUALIFICATIONS');
      doc.moveDown(0.3);
      doc.fillColor('#1f2937').fontSize(10).font('Helvetica-Bold').text('Institute of Chartered Accountants of India (ICAI)');
      doc.font('Helvetica').fontSize(9).fillColor('#4b5563');

      if (c.caPortfolio.caFinal) {
        const f = c.caPortfolio.caFinal;
        const finalStatus = f.bothGroups1stAttempt
          ? 'Cleared Both Groups in 1st Attempt'
          : `Group 1 (${f.group1Month || 'May'} ${f.group1Year || ''}): ${f.group1Attempts || 1} att., Group 2 (${f.group2Month || 'May'} ${f.group2Year || ''}): ${f.group2Attempts || 1} att.`;
        const session = f.completionSessionMonth && f.completionSessionYear ? ` [Completion: ${f.completionSessionMonth} ${f.completionSessionYear}]` : '';
        const rank = f.ranker && f.ranker !== 'No' ? ` (Rank: ${f.ranker})` : '';
        doc.text(`• CA Final: ${finalStatus}${session}${rank}`);
      }

      if (c.caPortfolio.caInter) {
        const i = c.caPortfolio.caInter;
        const interStatus = i.bothGroups1stAttempt
          ? 'Cleared Both Groups in 1st Attempt'
          : `Group 1 (${i.group1Month || 'May'} ${i.group1Year || ''}): ${i.group1Attempts || 1} att., Group 2 (${i.group2Month || 'May'} ${i.group2Year || ''}): ${i.group2Attempts || 1} att.`;
        const session = i.completionSessionMonth && i.completionSessionYear ? ` [Completion: ${i.completionSessionMonth} ${i.completionSessionYear}]` : '';
        const rank = i.ranker && i.ranker !== 'No' ? ` (Rank: ${i.ranker})` : '';
        doc.text(`• CA Inter (IPCC): ${interStatus}${session}${rank}`);
      }
      doc.moveDown(0.5);
    }

    // Academic Qualifications
    if (c.qualifications) {
      doc.fillColor('#0f2b48').fontSize(12).font('Helvetica-Bold').text('ACADEMIC QUALIFICATIONS');
      doc.moveDown(0.3);
      doc.font('Helvetica').fontSize(9).fillColor('#4b5563');

      if (c.qualifications.graduation) {
        const g = c.qualifications.graduation;
        doc.text(`• Graduation: ${g.courseName || 'B.Com'} - ${g.college || 'University'} (${g.yearOfCompletion || ''}) ${g.percentage ? `| ${g.percentage}%` : ''}`);
      }
      if (c.qualifications.class12) {
        const c12 = c.qualifications.class12;
        doc.text(`• Class XII: ${c12.board || 'CBSE'} (${c12.year || ''}) ${c12.percentage ? `| ${c12.percentage}%` : ''}`);
      }
      if (c.qualifications.class10) {
        const c10 = c.qualifications.class10;
        doc.text(`• Class X: ${c10.board || 'CBSE'} (${c10.year || ''}) ${c10.percentage ? `| ${c10.percentage}%` : ''}`);
      }
      doc.moveDown(0.8);
    }

    // Articleship Experience
    if (c.caPortfolio?.articleships && c.caPortfolio.articleships.length > 0) {
      doc.fillColor('#0f2b48').fontSize(12).font('Helvetica-Bold').text('ARTICLESHIP & PRACTICAL TRAINING');
      doc.moveDown(0.3);
      for (const art of c.caPortfolio.articleships) {
        if (art.firmName) {
          doc.fillColor('#1f2937').fontSize(10).font('Helvetica-Bold').text(`Articleship Trainee — ${art.firmName} (${art.city || 'India'})`);
          doc.font('Helvetica').fontSize(9).fillColor('#4b5563');
          doc.text(`Duration: ${art.noOfMonths || 36} Months  |  No. of Partners: ${art.noOfPartners || 2}  |  Big 4 Exposure: ${c.caPortfolio.big4Articleship || 'No'}`);
          doc.moveDown(0.3);
        }
      }
      doc.moveDown(0.5);
    }

    // Skills
    if (c.skills && Array.isArray(c.skills) && c.skills.length > 0) {
      doc.fillColor('#0f2b48').fontSize(12).font('Helvetica-Bold').text('SKILLS & COMPETENCIES');
      doc.moveDown(0.3);
      doc.font('Helvetica').fontSize(9).fillColor('#374151');
      doc.text(`• Core Skills: ${c.skills.join(', ')}`);
      doc.moveDown(0.8);
    }

    // Footer
    doc.moveDown(1);
    doc.fontSize(8).fillColor('#9ca3af').text('Generated for FAST Careers Portal Verification', { align: 'center' });

    doc.end();
  });
};

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

    // Local file path - check multiple locations
    const normalizedPath = cleanUrl.replace(/^\/+/, '');
    const filename = path.basename(normalizedPath);
    const possiblePaths = [
      path.join(__dirname, '../../', normalizedPath),
      path.join(__dirname, '../', normalizedPath),
      path.join(process.cwd(), normalizedPath),
      path.join(process.cwd(), 'uploads', filename),
      path.join(__dirname, '../../uploads', filename),
      path.join(__dirname, '../uploads', filename),
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        return fs.readFileSync(p);
      }
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
      if (candidate.resumeUrl && candidate.resumeUrl.trim().length > 0) {
        buffer = await fetchResumeBuffer(candidate.resumeUrl);
      }

      // Fallback: If uploaded resume could not be retrieved, generate PDF resume on the fly
      if (!buffer) {
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
