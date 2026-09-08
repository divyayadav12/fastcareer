import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import User from '../models/User';

// Generate a professional PDF resume buffer from candidate profile data
export const generateCandidatePdfBuffer = (c: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const fullName = `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Candidate Resume';

      // Header
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
      doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.8);

      // Professional Summary
      doc.fillColor('#0f2b48').fontSize(12).font('Helvetica-Bold').text('PROFESSIONAL SUMMARY');
      doc.moveDown(0.3);
      const isFresher = c.caPortfolio?.isFresherCA;
      const expText = c.experience ? `with ${c.experience} year(s) of experience` : '';
      const caType = isFresher ? 'Fresher Chartered Accountant' : `Chartered Accountant ${expText}`.trim();
      const skillsSnippet = Array.isArray(c.skills) && c.skills.length > 0 ? ` specializing in ${c.skills.slice(0, 4).join(', ')}` : '';
      doc.fillColor('#374151').fontSize(10).font('Helvetica').text(
        `${fullName} is a dedicated ${caType}${skillsSnippet}. Proven expertise in statutory compliance, taxation, auditing, and financial management.`
      );
      doc.moveDown(0.8);

      // CA Portfolio
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
          const session = f.completionSessionMonth && f.completionSessionYear ? ` [Batch: ${f.completionSessionMonth} ${f.completionSessionYear}]` : '';
          const rank = f.ranker && f.ranker !== 'No' ? ` (Rank: ${f.ranker})` : '';
          doc.text(`• CA Final: ${finalStatus}${session}${rank}`);
        }

        if (c.caPortfolio.caInter) {
          const i = c.caPortfolio.caInter;
          const interStatus = i.bothGroups1stAttempt
            ? 'Cleared Both Groups in 1st Attempt'
            : `Group 1 (${i.group1Month || 'May'} ${i.group1Year || ''}): ${i.group1Attempts || 1} att., Group 2 (${i.group2Month || 'May'} ${i.group2Year || ''}): ${i.group2Attempts || 1} att.`;
          const session = i.completionSessionMonth && i.completionSessionYear ? ` [Batch: ${i.completionSessionMonth} ${i.completionSessionYear}]` : '';
          const rank = i.ranker && i.ranker !== 'No' ? ` (Rank: ${i.ranker})` : '';
          doc.text(`• CA Inter (IPCC): ${interStatus}${session}${rank}`);
        }
        doc.moveDown(0.6);
      }

      // Academic Qualifications
      if (c.qualifications) {
        doc.fillColor('#0f2b48').fontSize(12).font('Helvetica-Bold').text('ACADEMIC QUALIFICATIONS');
        doc.moveDown(0.3);
        doc.font('Helvetica').fontSize(9).fillColor('#4b5563');

        if (c.qualifications.graduation) {
          const g = c.qualifications.graduation;
          doc.text(`• Graduation: ${g.courseName || 'B.Com'} - ${g.college || g.collegeName || 'University'} (${g.yearOfCompletion || 'Completed'}) ${g.percentage ? `| ${g.percentage}%` : ''}`);
        }
        if (c.qualifications.class12) {
          const c12 = c.qualifications.class12;
          doc.text(`• Class XII: ${c12.board || 'CBSE'} (${c12.year || ''}) ${c12.percentage ? `| ${c12.percentage}%` : ''}`);
        }
        if (c.qualifications.class10) {
          const c10 = c.qualifications.class10;
          doc.text(`• Class X: ${c10.board || 'CBSE'} (${c10.year || ''}) ${c10.percentage ? `| ${c10.percentage}%` : ''}`);
        }
        doc.moveDown(0.6);
      }

      // Articleship Experience
      if (c.caPortfolio?.articleships && c.caPortfolio.articleships.length > 0) {
        doc.fillColor('#0f2b48').fontSize(12).font('Helvetica-Bold').text('ARTICLESHIP & PRACTICAL TRAINING');
        doc.moveDown(0.3);
        for (const art of c.caPortfolio.articleships) {
          if (art.firmName || art.firmType) {
            doc.fillColor('#1f2937').fontSize(10).font('Helvetica-Bold').text(`Articleship Trainee — ${art.firmName || 'Audit Firm'} (${art.city || 'India'})`);
            doc.font('Helvetica').fontSize(9).fillColor('#4b5563');
            doc.text(`Firm Type: ${art.firmType || 'Medium'}  |  Duration: ${art.noOfMonths || 36} Months  |  Big 4 Exposure: ${c.caPortfolio.big4Articleship || 'No'}`);
            doc.text(`• Performed statutory, internal, and tax audits adhering to ICAI standards.`);
            doc.text(`• Analyzed financial statements, ledger accounts, and direct/indirect tax compliances.`);
            doc.moveDown(0.3);
          }
        }
        doc.moveDown(0.4);
      }

      // Skills
      if (c.skills && Array.isArray(c.skills) && c.skills.length > 0) {
        doc.fillColor('#0f2b48').fontSize(12).font('Helvetica-Bold').text('SKILLS & COMPETENCIES');
        doc.moveDown(0.3);
        doc.font('Helvetica').fontSize(9).fillColor('#374151');
        doc.text(`• Core Skills: ${c.skills.join(', ')}`);
        doc.text(`• Regulatory Frameworks: IND AS, IFRS, Income Tax Act, Companies Act 2013, GST`);
        doc.text(`• Software & Tools: MS Excel (Advanced), Tally Prime, SAP, Power BI`);
        doc.moveDown(0.8);
      }

      // Footer
      doc.moveDown(1);
      doc.fontSize(8).fillColor('#9ca3af').text('Generated for FAST Careers Verification & Recruitment', { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

// Find candidate from database matching a filename (e.g. resume_priya_patel.pdf or ID)
export const findCandidateByFilename = async (filename: string): Promise<any> => {
  try {
    const clean = filename.replace(/\.pdf$/i, '').trim();

    // 1. Direct match on resumeUrl field
    let candidate = await User.findOne({
      role: 'candidate',
      resumeUrl: { $regex: filename, $options: 'i' },
    });
    if (candidate) return candidate;

    // 2. Extract words from filename (e.g. resume_priya_patel -> ['priya', 'patel'])
    const parts = clean
      .replace(/^resume[_-]?/i, '')
      .split(/[_\-\s]+/)
      .filter(p => p.length > 1);

    if (parts.length >= 2) {
      const [first, ...rest] = parts;
      const last = rest.join(' ');
      candidate = await User.findOne({
        role: 'candidate',
        firstName: { $regex: new RegExp(`^${first}`, 'i') },
        lastName: { $regex: new RegExp(`^${last}`, 'i') },
      });
      if (candidate) return candidate;
    }

    if (parts.length === 1) {
      candidate = await User.findOne({
        role: 'candidate',
        $or: [
          { firstName: { $regex: new RegExp(parts[0], 'i') } },
          { lastName: { $regex: new RegExp(parts[0], 'i') } },
          { email: { $regex: new RegExp(parts[0], 'i') } },
        ],
      });
      if (candidate) return candidate;
    }

    // 3. Match candidate by MongoDB ObjectId if in filename
    const idMatch = filename.match(/[0-9a-fA-F]{24}/);
    if (idMatch) {
      candidate = await User.findById(idMatch[0]);
      if (candidate) return candidate;
    }

    return null;
  } catch (err) {
    console.error('Error finding candidate by filename:', err);
    return null;
  }
};

// Retrieve resume buffer (local file, Cloudinary, or generate on-the-fly)
export const fetchOrGenerateResumeBuffer = async (
  url?: string,
  candidate?: any
): Promise<Buffer | null> => {
  try {
    const cloudinaryPattern = 'https://res.cloudinary.com';
    let cleanUrl = (url || '').trim();

    if (cleanUrl.includes(cloudinaryPattern)) {
      cleanUrl = cleanUrl.substring(cleanUrl.indexOf(cloudinaryPattern));
    }

    // 1. If it's a Cloudinary or third-party remote storage URL
    if (
      (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) &&
      !cleanUrl.includes('/uploads/') &&
      !cleanUrl.includes('localhost') &&
      !cleanUrl.includes('fastcareer.onrender.com')
    ) {
      const response = await fetch(cleanUrl);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }
    }

    // 2. Check local disk paths
    let filename = cleanUrl;
    if (cleanUrl.includes('/uploads/')) {
      filename = cleanUrl.split('/uploads/')[1];
    } else {
      filename = path.basename(cleanUrl.replace(/^\/+/, ''));
    }

    if (filename) {
      const possiblePaths = [
        path.join(__dirname, '../../uploads', filename),
        path.join(__dirname, '../uploads', filename),
        path.join(process.cwd(), 'uploads', filename),
        path.join(process.cwd(), filename),
      ];

      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          return fs.readFileSync(p);
        }
      }
    }

    // 3. Generate dynamically if candidate is provided
    let candidateData = candidate;
    if (!candidateData && filename) {
      candidateData = await findCandidateByFilename(filename);
    }

    if (candidateData) {
      const generated = await generateCandidatePdfBuffer(candidateData);
      
      // Cache generated PDF to disk if uploads directory is writable
      if (filename) {
        try {
          const uploadsDir = path.join(process.cwd(), 'uploads');
          if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
          fs.writeFileSync(path.join(uploadsDir, filename), generated);
        } catch (saveErr) {
          // Read-only environment is fine
        }
      }

      return generated;
    }

    return null;
  } catch (err) {
    console.error('Error in fetchOrGenerateResumeBuffer:', err);
    return null;
  }
};
