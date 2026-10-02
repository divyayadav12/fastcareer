import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import User from './models/User';
import Job from './models/Job';
import Application from './models/Application';

dotenv.config();

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper to create PDF resume for candidate
const createPdfResume = (c: any, filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(uploadsDir, filename);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Header
    doc.fillColor('#0f2b48').fontSize(22).font('Helvetica-Bold').text(`${c.firstName} ${c.lastName}`, { align: 'left' });
    doc.fillColor('#4b5563').fontSize(11).font('Helvetica').text(c.headline, { align: 'left' });
    doc.moveDown(0.3);

    // Contact bar
    doc.fontSize(9).fillColor('#6b7280').text(
      `Email: ${c.email}  |  Phone: ${c.phone}  |  Location: ${c.personalDetails.currentCity}, ${c.personalDetails.currentState}`
    );
    doc.moveDown(0.6);

    // Divider
    doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.8);

    // Professional Summary
    doc.fillColor('#0f2b48').fontSize(13).font('Helvetica-Bold').text('PROFESSIONAL SUMMARY');
    doc.moveDown(0.3);
    const expText = c.experience ? `with ${c.experience} years of experience` : 'as a Fresher CA';
    doc.fillColor('#374151').fontSize(10).font('Helvetica').text(
      `${c.firstName} ${c.lastName} is a Chartered Accountant ${expText} specializing in ${c.skills.join(', ')}. Expert in statutory compliance, Ind AS financial reporting, corporate taxation, and internal controls.`
    );
    doc.moveDown(0.8);

    // Professional Qualifications
    doc.fillColor('#0f2b48').fontSize(13).font('Helvetica-Bold').text('PROFESSIONAL QUALIFICATIONS');
    doc.moveDown(0.3);
    doc.fillColor('#1f2937').fontSize(10).font('Helvetica-Bold').text('Institute of Chartered Accountants of India (ICAI)');
    doc.font('Helvetica').fontSize(9).fillColor('#4b5563');
    doc.text(`• CA Final: ${c.caPortfolio.caFinal.bothGroups1stAttempt ? 'Cleared Both Groups in 1st Attempt' : 'Completed'} [Batch: ${c.caPortfolio.caFinal.completionSessionMonth} ${c.caPortfolio.caFinal.completionSessionYear}] ${c.caPortfolio.caFinal.ranker && c.caPortfolio.caFinal.ranker !== 'No' ? '- AIR Rank: ' + c.caPortfolio.caFinal.ranker : ''}`);
    doc.text(`• CA Intermediate: Cleared Both Groups [Ranker: ${c.caPortfolio.caInter.ranker || 'No'}]`);
    doc.moveDown(0.6);

    // Key Skills
    doc.fillColor('#0f2b48').fontSize(13).font('Helvetica-Bold').text('KEY SKILLS & COMPETENCIES');
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(9).fillColor('#374151');
    doc.text(c.skills.join('  •  '));
    doc.moveDown(1.5);

    // Declaration
    doc.fontSize(8).fillColor('#9ca3af').text('Certified True Copy - FAST Careers Verified Candidate Profile', { align: 'center' });

    doc.end();

    stream.on('finish', () => resolve(`/uploads/${filename}`));
    stream.on('error', (err) => reject(err));
  });
};

const NEW_10_CANDIDATES = [
  {
    firstName: 'Aarav',
    lastName: 'Mehta',
    email: 'aarav.mehta.ca@fastcareer.in',
    phone: '9820111221',
    headline: 'Chartered Accountant - Financial Planning & Ind AS Reporting',
    experience: 3,
    skills: ['Ind AS 115', 'Financial Modeling', 'Statutory Audit', 'SAP FICO', 'Corporate Tax'],
    city: 'Mumbai',
    state: 'Maharashtra',
    isFresher: false
  },
  {
    firstName: 'Riya',
    lastName: 'Sharma',
    email: 'riya.sharma.ca@fastcareer.in',
    phone: '9820222332',
    headline: 'Fresher Chartered Accountant - AIR 18 CA Final',
    experience: 0,
    skills: ['Direct Taxation', 'GSTR-3B', 'Internal Audit', 'Tally Prime', 'IFRS'],
    city: 'Delhi',
    state: 'Delhi',
    isFresher: true
  },
  {
    firstName: 'Karan',
    lastName: 'Kapoor',
    email: 'karan.kapoor.ca@fastcareer.in',
    phone: '9820333443',
    headline: 'Senior Audit Manager & Indirect Tax Specialist',
    experience: 4,
    skills: ['GST Audit', 'Big 4 Experience', 'Transfer Pricing', 'Financial Analysis'],
    city: 'Bengaluru',
    state: 'Karnataka',
    isFresher: false
  },
  {
    firstName: 'Ananya',
    lastName: 'Deshmukh',
    email: 'ananya.deshmukh.ca@fastcareer.in',
    phone: '9820444554',
    headline: 'Fresher CA - Both Groups 1st Attempt',
    experience: 0,
    skills: ['Statutory Audit', 'Bank Reconciliation', 'MS Excel', 'Corporate Finance'],
    city: 'Pune',
    state: 'Maharashtra',
    isFresher: true
  },
  {
    firstName: 'Vikram',
    lastName: 'Singhania',
    email: 'vikram.singhania.ca@fastcareer.in',
    phone: '9820555665',
    headline: 'Chartered Accountant - FP&A & Treasury Management',
    experience: 5,
    skills: ['Cash Flow Forecasting', 'MIS Reporting', 'Ind AS 109', 'Budgeting'],
    city: 'Hyderabad',
    state: 'Telangana',
    isFresher: false
  },
  {
    firstName: 'Neha',
    lastName: 'Verma',
    email: 'neha.verma.ca@fastcareer.in',
    phone: '9820666776',
    headline: 'Fresher Chartered Accountant - Top Tier Articleship',
    experience: 0,
    skills: ['Tax Audits', 'TDS Filing', 'Company Law Compliance', 'Financial Statements'],
    city: 'Ahmedabad',
    state: 'Gujarat',
    isFresher: true
  },
  {
    firstName: 'Rohan',
    lastName: 'Joshi',
    email: 'rohan.joshi.ca@fastcareer.in',
    phone: '9820777887',
    headline: 'Internal Audit Lead & Risk Advisory Specialist',
    experience: 3,
    skills: ['Internal Financial Controls', 'SOX Compliance', 'Risk Management', 'SAP ERP'],
    city: 'Indore',
    state: 'Madhya Pradesh',
    isFresher: false
  },
  {
    firstName: 'Sneha',
    lastName: 'Gupta',
    email: 'sneha.gupta.ca@fastcareer.in',
    phone: '9820888998',
    headline: 'Fresher CA - Corporate Finance & Valuation Enthusiast',
    experience: 0,
    skills: ['M&A Due Diligence', 'Financial Valuation', 'Advanced Excel', 'Ind AS 116'],
    city: 'Kolkata',
    state: 'West Bengal',
    isFresher: true
  },
  {
    firstName: 'Aditya',
    lastName: 'Nair',
    email: 'aditya.nair.ca@fastcareer.in',
    phone: '9820999009',
    headline: 'Senior Taxation Specialist & Appellate Consultant',
    experience: 4,
    skills: ['Income Tax Appeals', 'International Tax', 'GST Returns', 'Cost Accounting'],
    city: 'Chennai',
    state: 'Tamil Nadu',
    isFresher: false
  },
  {
    firstName: 'Pooja',
    lastName: 'Bhatia',
    email: 'pooja.bhatia.ca@fastcareer.in',
    phone: '9821000110',
    headline: 'Fresher Chartered Accountant - AIR 42 CA Inter',
    experience: 0,
    skills: ['Auditing Standards', 'Financial Analysis', 'Tally ERP 9', 'Tax Advisory'],
    city: 'Chandigarh',
    state: 'Punjab',
    isFresher: true
  }
];

export const runApply10Candidates = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fastcareers';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB...');
    }

    // Find the target job "apply now" or any available jobs
    let targetJobs = await Job.find({ title: { $regex: /apply now/i } });
    if (targetJobs.length === 0) {
      targetJobs = await Job.find({});
    }

    if (targetJobs.length === 0) {
      console.log('No jobs found. Creating default "apply now" job...');
      const defaultJob = await Job.create({
        title: 'apply now',
        company: 'FAST Careers Partner',
        location: 'Pan India',
        type: 'Full-time',
        description: 'Immediate opening for CA candidate.',
        salaryRange: '₹8.0L - ₹15.0L'
      });
      targetJobs = [defaultJob];
    }

    console.log(`Targeting ${targetJobs.length} job(s), including "${targetJobs[0].title}"`);

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('Candidate@123', salt);

    const createdUsers: any[] = [];
    const createdApps: any[] = [];

    for (let i = 0; i < NEW_10_CANDIDATES.length; i++) {
      const c = NEW_10_CANDIDATES[i];
      const resumeFilename = `Resume_${c.firstName}_${c.lastName}_${Date.now()}.pdf`;

      const candidateData = {
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email.toLowerCase(),
        phone: c.phone,
        headline: c.headline,
        experience: c.experience,
        skills: c.skills,
        personalDetails: {
          currentCity: c.city,
          currentState: c.state,
          permanentCity: c.city,
          permanentState: c.state
        },
        caPortfolio: {
          isFresherCA: c.isFresher,
          caFinal: {
            bothGroups1stAttempt: c.isFresher,
            completionSessionMonth: 'May',
            completionSessionYear: '2024',
            ranker: c.isFresher ? 'No' : ''
          },
          caInter: {
            bothGroups1stAttempt: true,
            ranker: 'No'
          }
        }
      };

      const resumeUrl = await createPdfResume(candidateData, resumeFilename);

      let userDoc = await User.findOne({ email: c.email.toLowerCase() });
      if (!userDoc) {
        userDoc = await User.create({
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email.toLowerCase(),
          password: defaultPassword,
          role: 'candidate',
          phone: c.phone,
          resumeUrl: resumeUrl,
          personalDetails: candidateData.personalDetails,
          caPortfolio: candidateData.caPortfolio,
          skills: c.skills
        });
      } else {
        userDoc.resumeUrl = resumeUrl;
        userDoc.personalDetails = candidateData.personalDetails;
        userDoc.caPortfolio = candidateData.caPortfolio;
        await userDoc.save();
      }

      createdUsers.push(userDoc);

      // Apply for target jobs (especially "apply now" job)
      for (const targetJob of targetJobs) {
        let app = await Application.findOne({ candidate: userDoc._id, job: targetJob._id });
        if (!app) {
          app = await Application.create({
            candidate: userDoc._id,
            job: targetJob._id,
            resumeUrl: resumeUrl,
            coverLetter: `Dear Hiring Team,\n\nI am writing to submit my application for the ${targetJob.title} position at ${targetJob.company}.\n\nWith my background as a Chartered Accountant specializing in ${c.skills.slice(0, 3).join(', ')}, I am confident in adding immediate value to your organization.\n\nSincerely,\n${c.firstName} ${c.lastName}`,
            status: 'applied',
            companyStatus: 'Pending Review',
            sharedWithEmployer: true
          });
        } else {
          app.resumeUrl = resumeUrl;
          app.sharedWithEmployer = true;
          await app.save();
        }
        createdApps.push(app);
      }
    }

    console.log(`Successfully created ${createdUsers.length} candidate profiles and ${createdApps.length} job applications for "apply now" job!`);
    await mongoose.disconnect();
    return { createdUsers, createdApps };
  } catch (error) {
    console.error('Error applying 10 candidates:', error);
    await mongoose.disconnect();
    throw error;
  }
};

if (require.main === module) {
  runApply10Candidates();
}
