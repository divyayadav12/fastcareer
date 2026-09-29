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

// Generate PDF resume for each candidate
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
    const expText = c.experience ? `with ${c.experience} years of experience` : 'as a Fresher';
    doc.fillColor('#374151').fontSize(10).font('Helvetica').text(
      `${c.firstName} ${c.lastName} is a skilled Chartered Accountant ${expText} specializing in ${c.skills.join(', ')}. Demonstrated expertise in financial reporting, statutory compliance, auditing, and tax planning.`
    );
    doc.moveDown(0.8);

    // Professional Qualifications
    doc.fillColor('#0f2b48').fontSize(13).font('Helvetica-Bold').text('PROFESSIONAL QUALIFICATIONS');
    doc.moveDown(0.3);
    doc.fillColor('#1f2937').fontSize(10).font('Helvetica-Bold').text('Institute of Chartered Accountants of India (ICAI)');
    doc.font('Helvetica').fontSize(9).fillColor('#4b5563');
    doc.text(`• CA Final: ${c.caPortfolio.caFinal.bothGroups1stAttempt ? 'Cleared Both Groups in 1st Attempt' : 'Completed'} [Batch: ${c.caPortfolio.caFinal.completionSessionMonth} ${c.caPortfolio.caFinal.completionSessionYear}] ${c.caPortfolio.caFinal.ranker && c.caPortfolio.caFinal.ranker !== 'No' ? '- AIR Rank: ' + c.caPortfolio.caFinal.ranker : ''}`);
    doc.text(`• CA Intermediate: ${c.caPortfolio.caInter.bothGroups1stAttempt ? 'Cleared Both Groups in 1st Attempt' : 'Group 1: ' + c.caPortfolio.caInter.group1Attempts + ' attempt(s), Group 2: ' + c.caPortfolio.caInter.group2Attempts + ' attempt(s)'}`);
    doc.moveDown(0.6);

    // Articleship
    doc.fillColor('#0f2b48').fontSize(13).font('Helvetica-Bold').text('ARTICLESHIP & WORK EXPERIENCE');
    doc.moveDown(0.3);
    doc.fillColor('#1f2937').fontSize(10).font('Helvetica-Bold').text(`Firm: ${c.caPortfolio.articleships[0].firmName} (${c.caPortfolio.articleships[0].firmType})`);
    doc.font('Helvetica').fontSize(9).fillColor('#4b5563');
    doc.text(`Nature of Work: ${c.caPortfolio.natureOfWork}`);
    doc.text(`Duration: 36 Months (${c.caPortfolio.articleshipCompletionDate})`);
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

export const seed10AppliedCandidates = async (disconnect = false) => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fastcareers';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB for seeding 10 candidates...');
    }

    // 1. Ensure jobs exist
    let jobs = await Job.find({});
    if (jobs.length < 3) {
      console.log('Creating sample jobs...');
      const sampleJobs = [
        {
          title: 'Senior Statutory Audit Manager',
          company: 'Deloitte India',
          location: 'Mumbai, Maharashtra',
          type: 'Full-time',
          category: 'Audit & Assurance',
          salaryRange: '₹12LPA - ₹18LPA',
          description: 'Leading statutory audit engagements for listed clients under IND AS & IFRS framework.',
          requirements: ['CA Qualified', '3+ Years Experience', 'IND AS Expertise'],
          responsibilities: ['Managing audit teams', 'Client stakeholder communication', 'Reporting & Compliance'],
          isHot: true,
        },
        {
          title: 'Taxation & Regulatory Specialist',
          company: 'PwC India',
          location: 'Bengaluru, Karnataka',
          type: 'Full-time',
          category: 'Taxation',
          salaryRange: '₹10LPA - ₹15LPA',
          description: 'Handling corporate tax computations, GST advisory, and appellate proceedings.',
          requirements: ['CA Qualified', 'Direct & Indirect Tax Knowledge'],
          responsibilities: ['Filing returns', 'Tax planning', 'Representing before authorities'],
          isHot: true,
        },
        {
          title: 'Financial Analyst - FP&A',
          company: 'Tata Consultancy Services',
          location: 'Pune, Maharashtra',
          type: 'Full-time',
          category: 'Finance & Accounts',
          salaryRange: '₹9LPA - ₹14LPA',
          description: 'Variance analysis, annual budgeting, financial modeling, and executive dashboards.',
          requirements: ['CA / MBA Finance', 'Advanced Excel & PowerBI'],
          responsibilities: ['Monthly MIS reporting', 'Cost optimization analysis', 'Budget forecasting'],
          isHot: false,
        },
        {
          title: 'Assistant Manager - M&A Advisory',
          company: 'KPMG India',
          location: 'Gurugram, Haryana',
          type: 'Full-time',
          category: 'Corporate Finance',
          salaryRange: '₹14LPA - ₹20LPA',
          description: 'Financial due diligence, valuation modeling, and deal structuring for corporate M&A.',
          requirements: ['CA Ranker preferred', 'M&A Due diligence experience'],
          responsibilities: ['Data room management', 'Due diligence reports', 'Financial modeling'],
          isHot: true,
        },
      ];
      jobs = await Job.insertMany(sampleJobs);
    }

    const hashedPassword = await bcrypt.hash('Candidate@123', 10);

    const candidatesData = [
      {
        firstName: 'Aditya',
        lastName: 'Verma',
        email: 'aditya.verma.ca@gmail.com',
        phone: '9876543210',
        headline: 'Chartered Accountant | 3 Years Exp in Big 4 Statutory Audit',
        skills: ['Statutory Audit', 'IFRS', 'IndAS', 'Financial Reporting', 'Tally Prime'],
        experience: 3,
        personalDetails: {
          phone: '9876543210',
          currentCity: 'Mumbai',
          currentState: 'Maharashtra',
          gender: 'Male',
          maritalStatus: 'Unmarried',
          dateOfBirth: '1998-05-14',
        },
        caPortfolio: {
          isFresherCA: false,
          caFinal: {
            bothGroups1stAttempt: true,
            completionSessionMonth: 'May',
            completionSessionYear: '2023',
            ranker: 'AIR 14',
            percentage: '68.5',
          },
          caInter: {
            bothGroups1stAttempt: true,
            ranker: 'AIR 22',
            completionSessionMonth: 'May',
            completionSessionYear: '2021',
          },
          articleships: [
            { firmType: 'Big4', firmName: 'PwC India', city: 'Mumbai', noOfMonths: '36' }
          ],
          big4Articleship: 'Yes',
          gmcsCompleted: 'Yes',
          industrialTrainee: 'No',
          listedCompanyWork: 'Yes',
          natureOfWork: 'Statutory Audit of FMCG & Telecom listed companies.',
          articleshipCompletionDate: '2023-04-30',
        },
        qualifications: {
          graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com (Hons)', collegeName: 'St. Xavier College Mumbai', yearOfCompletion: '2020', percentage: '88' }
        },
        experienceInfo: {
          isExperienced: true,
          experienceYears: '3',
          currentCompanyName: 'PricewaterhouseCoopers',
          currentCTC: '₹14 LPA',
          expectedCTC: '₹18 LPA',
          currentDesignation: 'Senior Audit Associate',
          workProfile: 'Leading audit teams, IND AS financial statement preparation.',
        }
      },
      {
        firstName: 'Kavya',
        lastName: 'Nair',
        email: 'kavya.nair.ca@outlook.com',
        phone: '9812345678',
        headline: 'Fresher CA | Specializing in Corporate Taxation & Transfer Pricing',
        skills: ['Corporate Tax', 'Transfer Pricing', 'Direct Tax', 'GST Appeals', 'Income Tax'],
        experience: 0,
        personalDetails: {
          phone: '9812345678',
          currentCity: 'Bengaluru',
          currentState: 'Karnataka',
          gender: 'Female',
          maritalStatus: 'Unmarried',
          dateOfBirth: '2000-08-22',
        },
        caPortfolio: {
          isFresherCA: true,
          caFinal: {
            bothGroups1stAttempt: true,
            completionSessionMonth: 'November',
            completionSessionYear: '2024',
            ranker: 'No',
            percentage: '64.0',
          },
          caInter: {
            bothGroups1stAttempt: true,
            group1Attempts: '1',
            group2Attempts: '1',
          },
          articleships: [
            { firmType: 'Big4', firmName: 'Deloitte India', city: 'Bengaluru', noOfMonths: '36' }
          ],
          big4Articleship: 'Yes',
          gmcsCompleted: 'Yes',
          industrialTrainee: 'No',
          listedCompanyWork: 'Yes',
          natureOfWork: 'Corporate Direct Tax return filings & international tax assessments.',
          articleshipCompletionDate: '2024-10-15',
        },
        qualifications: {
          graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com', collegeName: 'Christ University Bengaluru', yearOfCompletion: '2021', percentage: '85' }
        },
        experienceInfo: {
          isExperienced: false,
          experienceYears: '0',
          currentCompanyName: 'N/A',
          currentCTC: 'Fresher',
          expectedCTC: '₹10 LPA',
          currentDesignation: 'Fresher CA',
          workProfile: 'Fresher CA looking for opportunities in Direct Tax.',
        }
      },
      {
        firstName: 'Rohan',
        lastName: 'Deshmukh',
        email: 'rohan.deshmukh98@yahoo.com',
        phone: '9765432109',
        headline: 'Senior Financial Analyst | Ex-EY | 4 Years Experience',
        skills: ['Financial Modeling', 'FP&A', 'Budgeting', 'Valuation', 'SAP ERP', 'PowerBI'],
        experience: 4,
        personalDetails: {
          phone: '9765432109',
          currentCity: 'Pune',
          currentState: 'Maharashtra',
          gender: 'Male',
          maritalStatus: 'Married',
          dateOfBirth: '1997-03-19',
        },
        caPortfolio: {
          isFresherCA: false,
          caFinal: {
            bothGroups1stAttempt: false,
            group1Attempts: '1',
            group2Attempts: '2',
            completionSessionMonth: 'May',
            completionSessionYear: '2022',
            ranker: 'No',
          },
          caInter: {
            bothGroups1stAttempt: false,
            group1Attempts: '1',
            group2Attempts: '1',
          },
          articleships: [
            { firmType: 'Big4', firmName: 'EY India', city: 'Pune', noOfMonths: '36' }
          ],
          big4Articleship: 'Yes',
          gmcsCompleted: 'Yes',
          industrialTrainee: 'Yes',
          listedCompanyWork: 'Yes',
          natureOfWork: 'Management consulting & financial planning for automotive sector.',
          articleshipCompletionDate: '2022-03-31',
        },
        qualifications: {
          graduation: { completed: 'Yes', type: 'CORRESPONDENCE', courseName: 'B.Com', collegeName: 'Pune University', yearOfCompletion: '2019', percentage: '76' }
        },
        experienceInfo: {
          isExperienced: true,
          experienceYears: '4',
          currentCompanyName: 'Ernst & Young Global',
          currentCTC: '₹15 LPA',
          expectedCTC: '₹19 LPA',
          currentDesignation: 'Senior Financial Consultant',
          workProfile: 'FP&A modeling, variance reporting, profitability analysis.',
        }
      },
      {
        firstName: 'Ananya',
        lastName: 'Sharma',
        email: 'ananya.sharma.ca@gmail.com',
        phone: '9988776655',
        headline: 'Fresher CA | AIR 28 Ranker | Both Groups 1st Attempt',
        skills: ['Internal Audit', 'Risk Assessment', 'SOX Compliance', 'Management Audit', 'SAP'],
        experience: 0,
        personalDetails: {
          phone: '9988776655',
          currentCity: 'New Delhi',
          currentState: 'Delhi',
          gender: 'Female',
          maritalStatus: 'Unmarried',
          dateOfBirth: '2001-01-10',
        },
        caPortfolio: {
          isFresherCA: true,
          caFinal: {
            bothGroups1stAttempt: true,
            completionSessionMonth: 'May',
            completionSessionYear: '2024',
            ranker: 'AIR 28',
            percentage: '71.2',
          },
          caInter: {
            bothGroups1stAttempt: true,
            ranker: 'AIR 35',
          },
          articleships: [
            { firmType: 'Big4', firmName: 'KPMG India', city: 'New Delhi', noOfMonths: '36' }
          ],
          big4Articleship: 'Yes',
          gmcsCompleted: 'Yes',
          industrialTrainee: 'No',
          listedCompanyWork: 'Yes',
          natureOfWork: 'Internal controls testing, SOX 404 compliance for Fortune 500 client.',
          articleshipCompletionDate: '2024-04-30',
        },
        qualifications: {
          graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com (Hons)', collegeName: 'SRCC Delhi University', yearOfCompletion: '2021', percentage: '96' }
        },
        experienceInfo: {
          isExperienced: false,
          experienceYears: '0',
          currentCompanyName: 'N/A',
          currentCTC: 'Fresher',
          expectedCTC: '₹12 LPA',
          currentDesignation: 'Fresher CA Ranker',
          workProfile: 'AIR 28 Ranker seeking internal audit or management consulting roles.',
        }
      },
      {
        firstName: 'Siddharth',
        lastName: 'Singhania',
        email: 'siddharth.singhania@gmail.com',
        phone: '9898989898',
        headline: 'Assistant Manager - Corporate Finance & M&A Advisory',
        skills: ['Due Diligence', 'M&A Advisory', 'Valuations', 'Corporate Restructuring', 'DCF Modeling'],
        experience: 2,
        personalDetails: {
          phone: '9898989898',
          currentCity: 'Gurugram',
          currentState: 'Haryana',
          gender: 'Male',
          maritalStatus: 'Unmarried',
          dateOfBirth: '1999-11-05',
        },
        caPortfolio: {
          isFresherCA: false,
          caFinal: {
            bothGroups1stAttempt: true,
            completionSessionMonth: 'November',
            completionSessionYear: '2023',
            ranker: 'No',
          },
          caInter: {
            bothGroups1stAttempt: true,
          },
          articleships: [
            { firmType: 'Medium', firmName: 'BDO India LLP', city: 'Gurugram', noOfMonths: '36' }
          ],
          big4Articleship: 'No',
          gmcsCompleted: 'Yes',
          industrialTrainee: 'Yes',
          listedCompanyWork: 'Yes',
          natureOfWork: 'Financial Due diligence for private equity transactions & buy-side advisory.',
          articleshipCompletionDate: '2023-10-31',
        },
        qualifications: {
          graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com', collegeName: 'Shaheed Bhagat Singh College Delhi', yearOfCompletion: '2020', percentage: '89' }
        },
        experienceInfo: {
          isExperienced: true,
          experienceYears: '2',
          currentCompanyName: 'BDO India LLP',
          currentCTC: '₹12 LPA',
          expectedCTC: '₹16 LPA',
          currentDesignation: 'Assistant Manager - Deal Advisory',
          workProfile: 'Performing financial due diligence, deal evaluation & DCF valuation models.',
        }
      },
      {
        firstName: 'Meera',
        lastName: 'Kulkarni',
        email: 'meera.kulkarni.ca@gmail.com',
        phone: '9711223344',
        headline: 'Chartered Accountant | GST & Indirect Tax Specialist',
        skills: ['Indirect Taxation', 'GST Appeals', 'Custom Duties', 'ERP Implementation', 'Audit'],
        experience: 2,
        personalDetails: {
          phone: '9711223344',
          currentCity: 'Ahmedabad',
          currentState: 'Gujarat',
          gender: 'Female',
          maritalStatus: 'Married',
          dateOfBirth: '1998-07-29',
        },
        caPortfolio: {
          isFresherCA: false,
          caFinal: {
            bothGroups1stAttempt: false,
            group1Attempts: '1',
            group2Attempts: '1',
            completionSessionMonth: 'May',
            completionSessionYear: '2023',
            ranker: 'No',
          },
          caInter: {
            bothGroups1stAttempt: true,
          },
          articleships: [
            { firmType: 'Medium', firmName: 'Grant Thornton India', city: 'Ahmedabad', noOfMonths: '36' }
          ],
          big4Articleship: 'No',
          gmcsCompleted: 'Yes',
          industrialTrainee: 'No',
          listedCompanyWork: 'Yes',
          natureOfWork: 'GST compliance, annual returns filing (GSTR-9/9C) and litigation support.',
          articleshipCompletionDate: '2023-04-30',
        },
        qualifications: {
          graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com', collegeName: 'HL College of Commerce Ahmedabad', yearOfCompletion: '2019', percentage: '82' }
        },
        experienceInfo: {
          isExperienced: true,
          experienceYears: '2',
          currentCompanyName: 'Grant Thornton Bharat',
          currentCTC: '₹11 LPA',
          expectedCTC: '₹14 LPA',
          currentDesignation: 'Senior Executive - Indirect Tax',
          workProfile: 'GST litigation, refund claims, indirect tax advisory.',
        }
      },
      {
        firstName: 'Devansh',
        lastName: 'Agarwal',
        email: 'devansh.agarwal99@gmail.com',
        phone: '9654321876',
        headline: 'CA Fresher | Expertise in Internal Controls & Forensic Audit',
        skills: ['Forensic Accounting', 'Risk Advisory', 'Fraud Investigation', 'Tally Prime', 'MS Excel'],
        experience: 0,
        personalDetails: {
          phone: '9654321876',
          currentCity: 'Jaipur',
          currentState: 'Rajasthan',
          gender: 'Male',
          maritalStatus: 'Unmarried',
          dateOfBirth: '2000-12-14',
        },
        caPortfolio: {
          isFresherCA: true,
          caFinal: {
            bothGroups1stAttempt: true,
            completionSessionMonth: 'November',
            completionSessionYear: '2024',
            ranker: 'No',
          },
          caInter: {
            bothGroups1stAttempt: true,
          },
          articleships: [
            { firmType: 'Medium', firmName: 'RSASM & Co Chartered Accountants', city: 'Jaipur', noOfMonths: '36' }
          ],
          big4Articleship: 'No',
          gmcsCompleted: 'Yes',
          industrialTrainee: 'No',
          listedCompanyWork: 'No',
          natureOfWork: 'Bank concurrent audit, internal control reviews, and forensic investigation.',
          articleshipCompletionDate: '2024-10-31',
        },
        qualifications: {
          graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com', collegeName: 'University of Rajasthan', yearOfCompletion: '2021', percentage: '79' }
        },
        experienceInfo: {
          isExperienced: false,
          experienceYears: '0',
          currentCompanyName: 'N/A',
          currentCTC: 'Fresher',
          expectedCTC: '₹8.5 LPA',
          currentDesignation: 'Fresher CA',
          workProfile: 'Fresher CA open to audit and risk management roles.',
        }
      },
      {
        firstName: 'Ishita',
        lastName: 'Joshi',
        email: 'ishita.joshi.ca@outlook.com',
        phone: '9543210987',
        headline: 'CA | 2 Years Exp in Treasury Management & Risk Compliance',
        skills: ['Treasury Operations', 'Forex Hedging', 'Asset Liability Management', 'Banking Controls'],
        experience: 2,
        personalDetails: {
          phone: '9543210987',
          currentCity: 'Hyderabad',
          currentState: 'Telangana',
          gender: 'Female',
          maritalStatus: 'Unmarried',
          dateOfBirth: '1999-04-18',
        },
        caPortfolio: {
          isFresherCA: false,
          caFinal: {
            bothGroups1stAttempt: true,
            completionSessionMonth: 'May',
            completionSessionYear: '2023',
            ranker: 'No',
          },
          caInter: {
            bothGroups1stAttempt: true,
          },
          articleships: [
            { firmType: 'Big4', firmName: 'KPMG Hyderabad', city: 'Hyderabad', noOfMonths: '36' }
          ],
          big4Articleship: 'Yes',
          gmcsCompleted: 'Yes',
          industrialTrainee: 'No',
          listedCompanyWork: 'Yes',
          natureOfWork: 'Audit of banking & financial institutions, liquidity risk management.',
          articleshipCompletionDate: '2023-04-30',
        },
        qualifications: {
          graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com (Hons)', collegeName: 'Loyola Academy Hyderabad', yearOfCompletion: '2020', percentage: '86' }
        },
        experienceInfo: {
          isExperienced: true,
          experienceYears: '2',
          currentCompanyName: 'ICICI Bank Corporate Office',
          currentCTC: '₹13 LPA',
          expectedCTC: '₹17 LPA',
          currentDesignation: 'Manager - Treasury & ALM',
          workProfile: 'Forex risk hedging, ALM mismatch reporting, cash flow forecasting.',
        }
      },
      {
        firstName: 'Karthik',
        lastName: 'Venkatraman',
        email: 'karthik.venkat.ca@gmail.com',
        phone: '9432109876',
        headline: 'Senior Manager - International Tax & Regulatory Services',
        skills: ['International Taxation', 'DTAA Treaties', 'FEMA Compliance', 'Cross Border M&A'],
        experience: 5,
        personalDetails: {
          phone: '9432109876',
          currentCity: 'Chennai',
          currentState: 'Tamil Nadu',
          gender: 'Male',
          maritalStatus: 'Married',
          dateOfBirth: '1996-09-02',
        },
        caPortfolio: {
          isFresherCA: false,
          caFinal: {
            bothGroups1stAttempt: true,
            completionSessionMonth: 'November',
            completionSessionYear: '2021',
            ranker: 'AIR 42',
          },
          caInter: {
            bothGroups1stAttempt: true,
          },
          articleships: [
            { firmType: 'Big4', firmName: 'PwC Chennai', city: 'Chennai', noOfMonths: '36' }
          ],
          big4Articleship: 'Yes',
          gmcsCompleted: 'Yes',
          industrialTrainee: 'No',
          listedCompanyWork: 'Yes',
          natureOfWork: 'Cross-border tax structuring, BEPS Pillar 2 advisory, FEMA filings.',
          articleshipCompletionDate: '2021-10-31',
        },
        qualifications: {
          graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com', collegeName: 'Loyola College Chennai', yearOfCompletion: '2017', percentage: '91' }
        },
        experienceInfo: {
          isExperienced: true,
          experienceYears: '5',
          currentCompanyName: 'PwC India - Tax Practice',
          currentCTC: '₹22 LPA',
          expectedCTC: '₹28 LPA',
          currentDesignation: 'Senior Manager - International Tax',
          workProfile: 'Cross-border tax advisory, withholding tax certification, DTAA interpretation.',
        }
      },
      {
        firstName: 'Radhika',
        lastName: 'Malhotra',
        email: 'radhika.malhotra.ca@gmail.com',
        phone: '9321098765',
        headline: 'Fresher CA | CA Inter & CA Final Both Groups 1st Attempt',
        skills: ['Financial Reporting', 'Statutory Audit', 'IND AS Transition', 'Tax Planning'],
        experience: 0,
        personalDetails: {
          phone: '9321098765',
          currentCity: 'Chandigarh',
          currentState: 'Punjab',
          gender: 'Female',
          maritalStatus: 'Unmarried',
          dateOfBirth: '2001-06-25',
        },
        caPortfolio: {
          isFresherCA: true,
          caFinal: {
            bothGroups1stAttempt: true,
            completionSessionMonth: 'November',
            completionSessionYear: '2024',
            ranker: 'No',
            percentage: '66.8',
          },
          caInter: {
            bothGroups1stAttempt: true,
          },
          articleships: [
            { firmType: 'Big4', firmName: 'Deloitte India', city: 'Gurugram', noOfMonths: '36' }
          ],
          big4Articleship: 'Yes',
          gmcsCompleted: 'Yes',
          industrialTrainee: 'No',
          listedCompanyWork: 'Yes',
          natureOfWork: 'Statutory audit of manufacturing & retail corporations under IND AS.',
          articleshipCompletionDate: '2024-10-31',
        },
        qualifications: {
          graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com (Hons)', collegeName: 'MCM DAV College Chandigarh', yearOfCompletion: '2021', percentage: '88' }
        },
        experienceInfo: {
          isExperienced: false,
          experienceYears: '0',
          currentCompanyName: 'N/A',
          currentCTC: 'Fresher',
          expectedCTC: '₹11 LPA',
          currentDesignation: 'Fresher CA',
          workProfile: 'Fresher CA looking for corporate finance or statutory audit positions.',
        }
      },
    ];

    const seededCandidates = [];
    const createdApplications = [];

    for (let i = 0; i < candidatesData.length; i++) {
      const cData = candidatesData[i];
      const filename = `Resume_${cData.firstName}_${cData.lastName}_${Date.now()}_${i + 1}.pdf`;
      
      // 1. Generate PDF resume
      const resumeUrl = await createPdfResume(cData, filename);

      // 2. Check if candidate exists, update or create
      let userDoc = await User.findOne({ email: cData.email });
      if (!userDoc) {
        userDoc = new User({
          ...cData,
          password: hashedPassword,
          role: 'candidate',
          resumeUrl: resumeUrl,
          profileCompleted: true,
        });
      } else {
        Object.assign(userDoc, cData);
        userDoc.resumeUrl = resumeUrl;
        userDoc.profileCompleted = true;
      }
      await userDoc.save();
      seededCandidates.push(userDoc);

      // 3. Create Applications for this candidate across jobs
      // Pick 1 or 2 jobs to apply for
      const job1 = jobs[i % jobs.length];
      const job2 = jobs[(i + 2) % jobs.length];
      const appliedJobs = [job1, job2];

      for (const targetJob of appliedJobs) {
        let app = await Application.findOne({ candidate: userDoc._id, job: targetJob._id });
        if (!app) {
          app = await Application.create({
            candidate: userDoc._id,
            job: targetJob._id,
            resumeUrl: resumeUrl,
            coverLetter: `Dear Hiring Team,\n\nI am writing to express my strong interest in the ${targetJob.title} position at ${targetJob.company}. As a qualified Chartered Accountant with expertise in ${cData.skills.slice(0, 3).join(', ')}, I am confident in my ability to deliver immediate value to your organization.\n\nSincerely,\n${cData.firstName} ${cData.lastName}`,
            status: 'applied',
            sharedWithEmployer: true,
          });
        } else {
          app.resumeUrl = resumeUrl;
          app.sharedWithEmployer = true;
          await app.save();
        }
        createdApplications.push(app);
      }
    }

    console.log(`Successfully seeded ${seededCandidates.length} new candidate records with resumes and created ${createdApplications.length} job applications!`);

    if (disconnect) {
      await mongoose.disconnect();
    }

    return {
      candidatesCount: seededCandidates.length,
      applicationsCount: createdApplications.length,
      candidates: seededCandidates,
    };
  } catch (error) {
    console.error('Error seeding 10 applied candidates:', error);
    if (disconnect) {
      await mongoose.disconnect();
    }
    throw error;
  }
};

if (require.main === module) {
  seed10AppliedCandidates(true);
}
