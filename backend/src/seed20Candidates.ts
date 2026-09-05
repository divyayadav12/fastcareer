import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import * as xlsx from 'xlsx';
import User from './models/User';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fastcareers';

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Generate a professional PDF resume using PDFKit
const createProfessionalResume = (c: any, filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(uploadsDir, filename);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Header / Title
    doc.fillColor('#0f2b48').fontSize(22).font('Helvetica-Bold').text(`${c.firstName} ${c.lastName}`, { align: 'left' });
    doc.fillColor('#4b5563').fontSize(11).font('Helvetica').text(c.headline, { align: 'left' });
    doc.moveDown(0.3);

    // Contact info bar
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
    doc.fillColor('#374151').fontSize(10).font('Helvetica').text(
      `${c.firstName} is a dedicated ${c.caPortfolio.isFresherCA ? 'Fresher Chartered Accountant' : 'Chartered Accountant with ' + c.experience + ' years of experience'} specializing in ${c.skills.slice(0, 3).join(', ')}. Demonstrated expertise in statutory compliance, audit, and strategic financial management.`
    );
    doc.moveDown(0.8);

    // CA Portfolio & Education
    doc.fillColor('#0f2b48').fontSize(13).font('Helvetica-Bold').text('PROFESSIONAL QUALIFICATIONS');
    doc.moveDown(0.3);
    doc.fillColor('#1f2937').fontSize(10).font('Helvetica-Bold').text('Institute of Chartered Accountants of India (ICAI)');
    doc.font('Helvetica').fontSize(9).fillColor('#4b5563');
    doc.text(`• CA Final: ${c.caPortfolio.caFinal.bothGroups1stAttempt ? 'Cleared Both Groups in 1st Attempt' : 'Completed (Batch: ' + c.caPortfolio.caFinal.completionSessionMonth + ' ' + c.caPortfolio.caFinal.completionSessionYear + ')'} ${c.caPortfolio.caFinal.ranker !== 'No' ? '- Rank: ' + c.caPortfolio.caFinal.ranker : ''}`);
    doc.text(`• CA Intermediate: ${c.caPortfolio.caInter.bothGroups1stAttempt ? 'Cleared Both Groups in 1st Attempt' : 'Group 1: ' + c.caPortfolio.caInter.group1Attempts + ' attempt(s), Group 2: ' + c.caPortfolio.caInter.group2Attempts + ' attempt(s)'}`);
    doc.moveDown(0.5);

    doc.fillColor('#1f2937').fontSize(10).font('Helvetica-Bold').text('Academic Degree');
    doc.font('Helvetica').fontSize(9).fillColor('#4b5563');
    doc.text(`• ${c.qualifications.graduation.courseName} - ${c.qualifications.graduation.college} (${c.qualifications.graduation.yearOfCompletion}) - Score: ${c.qualifications.graduation.percentage}%`);
    doc.moveDown(0.8);

    // Articleship Experience
    doc.fillColor('#0f2b48').fontSize(13).font('Helvetica-Bold').text('ARTICLESHIP & WORK EXPERIENCE');
    doc.moveDown(0.3);
    if (c.caPortfolio.articleships && c.caPortfolio.articleships.length > 0) {
      const art = c.caPortfolio.articleships[0];
      doc.fillColor('#1f2937').fontSize(10).font('Helvetica-Bold').text(`Articleship Trainee - ${art.firmName} (${art.city})`);
      doc.font('Helvetica').fontSize(9).fillColor('#4b5563');
      doc.text(`Firm Type: ${art.firmType}  |  Big 4 Exposure: ${c.caPortfolio.big4Articleship || 'N/A'}  |  Duration: ${art.noOfMonths} Months`);
      doc.text(`• Led statutory and tax audit engagements for diverse client portfolios.`);
      doc.text(`• Formulated audit schedules, performed analytical reviews, and prepared financial statements in compliance with IND AS.`);
      doc.text(`• Managed GST return filings, reconciliation, and representation before tax authorities.`);
    }
    doc.moveDown(0.8);

    // Core Competencies & Skills
    doc.fillColor('#0f2b48').fontSize(13).font('Helvetica-Bold').text('CORE SKILLS & EXPERTISE');
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(9).fillColor('#374151');
    doc.text(`• Key Skills: ${c.skills.join(', ')}`);
    doc.text(`• Regulatory Frameworks: IND AS, IFRS, Income Tax Act, Companies Act 2013, GST Law`);
    doc.text(`• Software & Tools: Tally Prime, SAP FICO, Advanced MS Excel, Power BI`);
    doc.moveDown(1.5);

    // Footer
    doc.fontSize(8).fillColor('#9ca3af').text('Generated for FAST Careers recruitment portal verification.', { align: 'center' });

    doc.end();

    stream.on('finish', () => resolve(`/uploads/${filename}`));
    stream.on('error', reject);
  });
};

const candidateData = [
  {
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@fastcareers.in',
    phone: '+91 98201 12345',
    headline: 'Chartered Accountant | Statutory Audit | Ex-EY',
    skills: ['Statutory Audit', 'IND AS', 'Direct Tax', 'IFRS', 'Financial Reporting'],
    experience: 2,
    hasResumeFile: true,
    personalDetails: {
      currentCity: 'Mumbai',
      currentState: 'Maharashtra',
      currentAddress: '402, Sea Green Apts, Worli, Mumbai',
      gender: 'Male',
      maritalStatus: 'Unmarried',
      dateOfBirth: '1998-05-14',
    },
    caPortfolio: {
      isFresherCA: false,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No', completionSessionMonth: 'May', completionSessionYear: '2023' },
      big4Articleship: 'EY',
      articleships: [{ firmType: 'Big 4', firmName: 'Ernst & Young LLP', city: 'Mumbai', noOfMonths: '36', noOfPartners: '50+' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'No',
      listedCompanyWork: 'Yes',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com (Hons)', college: 'Narsee Monjee College', yearOfCompletion: '2020', percentage: '88' },
    },
  },
  {
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@fastcareers.in',
    phone: '+91 98795 23456',
    headline: 'CA Finalist | Direct Taxation & Transfer Pricing',
    skills: ['Direct Tax', 'Transfer Pricing', 'Tax Audit', 'TDS', 'Tally Prime'],
    experience: 1,
    hasResumeFile: true,
    personalDetails: {
      currentCity: 'Ahmedabad',
      currentState: 'Gujarat',
      currentAddress: '12, Shanti Niketan Society, Navrangpura',
      gender: 'Female',
      maritalStatus: 'Unmarried',
      dateOfBirth: '1999-08-22',
    },
    caPortfolio: {
      isFresherCA: true,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: false, group1Attempts: '1', group2Attempts: '2', ranker: 'No', completionSessionMonth: 'November', completionSessionYear: '2024' },
      big4Articleship: 'No',
      articleships: [{ firmType: 'Top 20', firmName: 'Dhirubhai Shah & Co', city: 'Ahmedabad', noOfMonths: '36', noOfPartners: '15' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'No',
      listedCompanyWork: 'No',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com', college: 'HL College of Commerce', yearOfCompletion: '2021', percentage: '84' },
    },
  },
  {
    firstName: 'Amit',
    lastName: 'Verma',
    email: 'amit.verma@fastcareers.in',
    phone: '+91 98112 34567',
    headline: 'Fresher CA | 1st Attempt Both Groups | Industrial Trainee',
    skills: ['Financial Modeling', 'Corporate Finance', 'Valuation', 'Treasury', 'IND AS'],
    experience: 0,
    hasResumeFile: true,
    personalDetails: {
      currentCity: 'Delhi',
      currentState: 'Delhi',
      currentAddress: 'B-45, Greater Kailash Part 1, New Delhi',
      gender: 'Male',
      maritalStatus: 'Unmarried',
      dateOfBirth: '2000-01-10',
    },
    caPortfolio: {
      isFresherCA: true,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No', completionSessionMonth: 'May', completionSessionYear: '2024' },
      big4Articleship: 'PwC',
      articleships: [{ firmType: 'Big 4', firmName: 'PricewaterhouseCoopers', city: 'Gurugram', noOfMonths: '24', noOfPartners: '40+' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'Yes',
      listedCompanyWork: 'Yes',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com (Hons)', college: 'SRCC - Shri Ram College of Commerce', yearOfCompletion: '2022', percentage: '94' },
    },
  },
  {
    firstName: 'Neha',
    lastName: 'Singh',
    email: 'neha.singh@fastcareers.in',
    phone: '+91 99801 45678',
    headline: 'Chartered Accountant | Internal Audit & Risk Advisory',
    skills: ['Internal Audit', 'Risk Management', 'SOX Compliance', 'Forensic Audit', 'SAP'],
    experience: 3,
    hasResumeFile: true,
    personalDetails: {
      currentCity: 'Bengaluru',
      currentState: 'Karnataka',
      currentAddress: '78, 4th Main, Indiranagar, Bengaluru',
      gender: 'Female',
      maritalStatus: 'Married',
      dateOfBirth: '1997-11-05',
    },
    caPortfolio: {
      isFresherCA: false,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No', completionSessionMonth: 'November', completionSessionYear: '2022' },
      big4Articleship: 'KPMG',
      articleships: [{ firmType: 'Big 4', firmName: 'KPMG India', city: 'Bengaluru', noOfMonths: '36', noOfPartners: '60+' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'No',
      listedCompanyWork: 'Yes',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com', college: 'Christ University', yearOfCompletion: '2019', percentage: '86' },
    },
  },
  {
    firstName: 'Vikram',
    lastName: 'Malhotra',
    email: 'vikram.malhotra@fastcareers.in',
    phone: '+91 98220 56789',
    headline: 'Senior Associate | M&A Tax & Due Diligence',
    skills: ['M&A Tax', 'Due Diligence', 'Cross Border Taxation', 'Valuation', 'Corporate Restructuring'],
    experience: 4,
    hasResumeFile: true,
    personalDetails: {
      currentCity: 'Pune',
      currentState: 'Maharashtra',
      currentAddress: 'Flat 503, Clover Highlands, NIBM Road, Pune',
      gender: 'Male',
      maritalStatus: 'Married',
      dateOfBirth: '1996-03-18',
    },
    caPortfolio: {
      isFresherCA: false,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No', completionSessionMonth: 'May', completionSessionYear: '2021' },
      big4Articleship: 'Deloitte',
      articleships: [{ firmType: 'Big 4', firmName: 'Deloitte Haskins & Sells', city: 'Pune', noOfMonths: '36', noOfPartners: '45+' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'No',
      listedCompanyWork: 'Yes',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com', college: 'BMCC Pune', yearOfCompletion: '2018', percentage: '82' },
    },
  },
  {
    firstName: 'Ananya',
    lastName: 'Gupta',
    email: 'ananya.gupta@fastcareers.in',
    phone: '+91 98300 67890',
    headline: 'Chartered Accountant | Financial Reporting & IND AS',
    skills: ['IND AS', 'Financial Reporting', 'Consolidation', 'Audit Assistance', 'Power BI'],
    experience: 1,
    hasResumeFile: true,
    personalDetails: {
      currentCity: 'Kolkata',
      currentState: 'West Bengal',
      currentAddress: '34/1, Ballygunge Circular Road, Kolkata',
      gender: 'Female',
      maritalStatus: 'Unmarried',
      dateOfBirth: '1999-07-30',
    },
    caPortfolio: {
      isFresherCA: false,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No', completionSessionMonth: 'May', completionSessionYear: '2023' },
      big4Articleship: 'PwC',
      articleships: [{ firmType: 'Big 4', firmName: 'Price Waterhouse & Co', city: 'Kolkata', noOfMonths: '36', noOfPartners: '30+' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'No',
      listedCompanyWork: 'Yes',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com (Hons)', college: "St. Xavier's College Kolkata", yearOfCompletion: '2020', percentage: '91' },
    },
  },
  {
    firstName: 'Rohan',
    lastName: 'Mehta',
    email: 'rohan.mehta@fastcareers.in',
    phone: '+91 98490 78901',
    headline: 'CA & B.Com Hons | Treasury & Corporate Finance',
    skills: ['Treasury Management', 'Cash Flow Forecasting', 'Forex Risk', 'Working Capital', 'Advanced Excel'],
    experience: 2,
    hasResumeFile: true,
    personalDetails: {
      currentCity: 'Hyderabad',
      currentState: 'Telangana',
      currentAddress: 'Plot 89, Jubilee Hills, Road No 36, Hyderabad',
      gender: 'Male',
      maritalStatus: 'Unmarried',
      dateOfBirth: '1998-09-12',
    },
    caPortfolio: {
      isFresherCA: false,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: false, group1Attempts: '1', group2Attempts: '2', ranker: 'No', completionSessionMonth: 'November', completionSessionYear: '2023' },
      big4Articleship: 'No',
      articleships: [{ firmType: 'Top 20', firmName: 'Brahmayya & Co', city: 'Hyderabad', noOfMonths: '36', noOfPartners: '20' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'Yes',
      listedCompanyWork: 'Yes',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com', college: 'Loyola Academy Hyderabad', yearOfCompletion: '2020', percentage: '85' },
    },
  },
  {
    firstName: 'Sneha',
    lastName: 'Reddy',
    email: 'sneha.reddy@fastcareers.in',
    phone: '+91 98401 89012',
    headline: 'Chartered Accountant | GST & Indirect Taxes Specialist',
    skills: ['GST Audit', 'Indirect Taxation', 'Customs Law', 'Input Tax Credit', 'Litigation Support'],
    experience: 2,
    hasResumeFile: true,
    personalDetails: {
      currentCity: 'Chennai',
      currentState: 'Tamil Nadu',
      currentAddress: '15, Anna Nagar West, Chennai',
      gender: 'Female',
      maritalStatus: 'Unmarried',
      dateOfBirth: '1998-12-04',
    },
    caPortfolio: {
      isFresherCA: false,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No', completionSessionMonth: 'May', completionSessionYear: '2023' },
      big4Articleship: 'EY',
      articleships: [{ firmType: 'Big 4', firmName: 'Ernst & Young LLP', city: 'Chennai', noOfMonths: '36', noOfPartners: '35+' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'No',
      listedCompanyWork: 'Yes',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com', college: 'Stella Maris College', yearOfCompletion: '2020', percentage: '89' },
    },
  },
  {
    firstName: 'Aditya',
    lastName: 'Joshi',
    email: 'aditya.joshi@fastcareers.in',
    phone: '+91 98290 90123',
    headline: 'CA Final Ranker AIR 12 | Equity Research Analyst',
    skills: ['Equity Research', 'Valuation DCF', 'Financial Modeling', 'Securities Analysis', 'Python for Finance'],
    experience: 1,
    hasResumeFile: true,
    personalDetails: {
      currentCity: 'Jaipur',
      currentState: 'Rajasthan',
      currentAddress: '56, Malviya Nagar, Jaipur',
      gender: 'Male',
      maritalStatus: 'Unmarried',
      dateOfBirth: '2000-04-25',
    },
    caPortfolio: {
      isFresherCA: true,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'AIR 28' },
      caFinal: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'AIR 12', completionSessionMonth: 'May', completionSessionYear: '2024' },
      big4Articleship: 'No',
      articleships: [{ firmType: 'Top 20', firmName: 'Kalani & Co', city: 'Jaipur', noOfMonths: '36', noOfPartners: '12' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'No',
      listedCompanyWork: 'No',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com (Hons)', college: 'University of Rajasthan', yearOfCompletion: '2021', percentage: '92' },
    },
  },
  {
    firstName: 'Pooja',
    lastName: 'Nair',
    email: 'pooja.nair@fastcareers.in',
    phone: '+91 98470 01234',
    headline: 'Chartered Accountant | FP&A & Management Reporting',
    skills: ['FP&A', 'Budgeting & Forecasting', 'Variance Analysis', 'ERP SAP', 'Management Reporting'],
    experience: 3,
    hasResumeFile: true,
    personalDetails: {
      currentCity: 'Kochi',
      currentState: 'Kerala',
      currentAddress: '23/450, Panampilly Nagar, Kochi',
      gender: 'Female',
      maritalStatus: 'Married',
      dateOfBirth: '1997-02-17',
    },
    caPortfolio: {
      isFresherCA: false,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No', completionSessionMonth: 'November', completionSessionYear: '2022' },
      big4Articleship: 'KPMG',
      articleships: [{ firmType: 'Big 4', firmName: 'KPMG India', city: 'Kochi', noOfMonths: '36', noOfPartners: '20+' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'No',
      listedCompanyWork: 'Yes',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com', college: 'Sacred Heart College Thevara', yearOfCompletion: '2019', percentage: '87' },
    },
  },
  {
    firstName: 'Kunal',
    lastName: 'Kapoor',
    email: 'kunal.kapoor@fastcareers.in',
    phone: '+91 98101 11223',
    headline: 'Audit Senior | Big 4 Articleship - Deloitte',
    skills: ['Statutory Audit', 'Internal Controls', 'SOX 404', 'US GAAP', 'IND AS'],
    experience: 2,
    hasResumeFile: true,
    personalDetails: {
      currentCity: 'Gurugram',
      currentState: 'Haryana',
      currentAddress: 'Tower B, DLF Phase 5, Gurugram',
      gender: 'Male',
      maritalStatus: 'Unmarried',
      dateOfBirth: '1998-06-19',
    },
    caPortfolio: {
      isFresherCA: false,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No', completionSessionMonth: 'May', completionSessionYear: '2023' },
      big4Articleship: 'Deloitte',
      articleships: [{ firmType: 'Big 4', firmName: 'Deloitte Touche Tohmatsu', city: 'Gurugram', noOfMonths: '36', noOfPartners: '80+' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'No',
      listedCompanyWork: 'Yes',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com (Hons)', college: 'Hansraj College, Delhi University', yearOfCompletion: '2020', percentage: '90' },
    },
  },
  {
    firstName: 'Divya',
    lastName: 'Saxena',
    email: 'divya.saxena@fastcareers.in',
    phone: '+91 98188 22334',
    headline: 'Chartered Accountant | Valuations & Financial Modeling',
    skills: ['Business Valuation', 'Financial Modeling', 'Purchase Price Allocation', 'IB & PE Support', 'IND AS 113'],
    experience: 1,
    hasResumeFile: true,
    personalDetails: {
      currentCity: 'Noida',
      currentState: 'Uttar Pradesh',
      currentAddress: 'Sector 62, Noida, Gautam Buddha Nagar',
      gender: 'Female',
      maritalStatus: 'Unmarried',
      dateOfBirth: '2000-03-08',
    },
    caPortfolio: {
      isFresherCA: true,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No', completionSessionMonth: 'May', completionSessionYear: '2024' },
      big4Articleship: 'PwC',
      articleships: [{ firmType: 'Big 4', firmName: 'PwC Deals Practice', city: 'Noida', noOfMonths: '36', noOfPartners: '30+' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'No',
      listedCompanyWork: 'Yes',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com (Hons)', college: 'Lady Shri Ram College', yearOfCompletion: '2021', percentage: '93' },
    },
  },
  {
    firstName: 'Manish',
    lastName: 'Agarwal',
    email: 'manish.agarwal@fastcareers.in',
    phone: '+91 98270 33445',
    headline: 'CA Finalist | Forensic Audit & Fraud Investigation',
    skills: ['Forensic Audit', 'Data Analytics', 'Fraud Risk Assessment', 'Anti-Money Laundering', 'MS SQL'],
    experience: 1,
    hasResumeFile: true,
    personalDetails: {
      currentCity: 'Indore',
      currentState: 'Madhya Pradesh',
      currentAddress: '78, Vijay Nagar Scheme 54, Indore',
      gender: 'Male',
      maritalStatus: 'Unmarried',
      dateOfBirth: '1999-10-15',
    },
    caPortfolio: {
      isFresherCA: true,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: false, group1Attempts: '1', group2Attempts: '2', ranker: 'No', completionSessionMonth: 'November', completionSessionYear: '2024' },
      big4Articleship: 'No',
      articleships: [{ firmType: 'Top 20', firmName: 'Singhi & Co', city: 'Indore', noOfMonths: '36', noOfPartners: '18' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'No',
      listedCompanyWork: 'No',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com', college: 'Prestige Institute of Management Indore', yearOfCompletion: '2021', percentage: '81' },
    },
  },
  {
    firstName: 'Ritu',
    lastName: 'Jain',
    email: 'ritu.jain@fastcareers.in',
    phone: '+91 98720 44556',
    headline: 'Chartered Accountant | International Taxation | Ex-PwC',
    skills: ['International Tax', 'DTAA', 'BEPS', 'Expatriate Taxation', 'Corporate Tax'],
    experience: 3,
    hasResumeFile: true,
    personalDetails: {
      currentCity: 'Chandigarh',
      currentState: 'Punjab',
      currentAddress: 'House 304, Sector 18-C, Chandigarh',
      gender: 'Female',
      maritalStatus: 'Married',
      dateOfBirth: '1997-08-11',
    },
    caPortfolio: {
      isFresherCA: false,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No', completionSessionMonth: 'November', completionSessionYear: '2022' },
      big4Articleship: 'PwC',
      articleships: [{ firmType: 'Big 4', firmName: 'PricewaterhouseCoopers', city: 'Gurugram', noOfMonths: '36', noOfPartners: '50+' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'No',
      listedCompanyWork: 'Yes',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com', college: 'MCM DAV College Chandigarh', yearOfCompletion: '2019', percentage: '88' },
    },
  },
  {
    firstName: 'Saurabh',
    lastName: 'Mishra',
    email: 'saurabh.mishra@fastcareers.in',
    phone: '+91 94150 55667',
    headline: 'Chartered Accountant | Credit Risk & Commercial Lending',
    skills: ['Credit Risk Assessment', 'Working Capital Assessment', 'Project Finance', 'CMA Data Preparation', 'Banking Operations'],
    experience: 2,
    hasResumeFile: true,
    personalDetails: {
      currentCity: 'Lucknow',
      currentState: 'Uttar Pradesh',
      currentAddress: '14/56, Gomti Nagar, Lucknow',
      gender: 'Male',
      maritalStatus: 'Unmarried',
      dateOfBirth: '1998-04-02',
    },
    caPortfolio: {
      isFresherCA: false,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No', completionSessionMonth: 'May', completionSessionYear: '2023' },
      big4Articleship: 'No',
      articleships: [{ firmType: 'Top 20', firmName: 'Luthra & Luthra Chartered Accountants', city: 'Lucknow', noOfMonths: '36', noOfPartners: '14' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'Yes',
      listedCompanyWork: 'No',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com', college: 'Lucknow University', yearOfCompletion: '2020', percentage: '83' },
    },
  },
  {
    firstName: 'Tanvi',
    lastName: 'Kulkarni',
    email: 'tanvi.kulkarni@fastcareers.in',
    phone: '+91 98200 66778',
    headline: 'Fresher CA | Top 20 Firm Articleship - BDO',
    skills: ['Statutory Audit', 'Direct Tax', 'Bank Audit', 'IND AS', 'Tally ERP 9'],
    experience: 0,
    hasResumeFile: true,
    personalDetails: {
      currentCity: 'Mumbai',
      currentState: 'Maharashtra',
      currentAddress: 'Flat 10, Shivaji Park, Dadar West, Mumbai',
      gender: 'Female',
      maritalStatus: 'Unmarried',
      dateOfBirth: '2000-09-18',
    },
    caPortfolio: {
      isFresherCA: true,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No', completionSessionMonth: 'May', completionSessionYear: '2024' },
      big4Articleship: 'No',
      articleships: [{ firmType: 'Top 20', firmName: 'BDO India LLP', city: 'Mumbai', noOfMonths: '36', noOfPartners: '30+' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'No',
      listedCompanyWork: 'Yes',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com (Hons)', college: 'R.A. Podar College Mumbai', yearOfCompletion: '2021', percentage: '89' },
    },
  },
  // 4 Candidates without Resumes (to test resume availability badges & disable checkbox behavior)
  {
    firstName: 'Deepesh',
    lastName: 'Bansal',
    email: 'deepesh.bansal@fastcareers.in',
    phone: '+91 98250 77889',
    headline: 'CA Inter Both Groups 1st Attempt | Audit Semi-Senior',
    skills: ['Audit Assistance', 'GST Filing', 'Bookkeeping', 'Tally Prime'],
    experience: 1,
    hasResumeFile: false, // NO RESUME
    personalDetails: {
      currentCity: 'Surat',
      currentState: 'Gujarat',
      currentAddress: 'Ring Road, Surat',
      gender: 'Male',
      maritalStatus: 'Unmarried',
      dateOfBirth: '2001-02-14',
    },
    caPortfolio: {
      isFresherCA: true,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: false, group1Attempts: '2', group2Attempts: '2', ranker: 'No' },
      big4Articleship: 'No',
      articleships: [{ firmType: 'Other', firmName: 'Bansal & Associates', city: 'Surat', noOfMonths: '24', noOfPartners: '4' }],
      gmcsCompleted: 'No',
      industrialTrainee: 'No',
      listedCompanyWork: 'No',
    },
    qualifications: {
      graduation: { completed: 'No/Pursuing', type: 'REGULAR', courseName: 'B.Com', college: 'VNSGU Surat', yearOfCompletion: '2023', percentage: '76' },
    },
  },
  {
    firstName: 'Kavita',
    lastName: 'Choudhary',
    email: 'kavita.choudhary@fastcareers.in',
    phone: '+91 94250 88990',
    headline: 'Chartered Accountant | Costing & Budgetary Control',
    skills: ['Cost Accounting', 'Budgeting', 'Variance Analysis', 'ERP Systems'],
    experience: 2,
    hasResumeFile: false, // NO RESUME
    personalDetails: {
      currentCity: 'Bhopal',
      currentState: 'Madhya Pradesh',
      currentAddress: 'Arera Colony, Bhopal',
      gender: 'Female',
      maritalStatus: 'Unmarried',
      dateOfBirth: '1998-07-21',
    },
    caPortfolio: {
      isFresherCA: false,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: false, group1Attempts: '1', group2Attempts: '2', ranker: 'No', completionSessionMonth: 'November', completionSessionYear: '2023' },
      big4Articleship: 'No',
      articleships: [{ firmType: 'Top 20', firmName: 'Choudhary & Co', city: 'Bhopal', noOfMonths: '36', noOfPartners: '6' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'No',
      listedCompanyWork: 'No',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com', college: 'Barkatullah University Bhopal', yearOfCompletion: '2020', percentage: '80' },
    },
  },
  {
    firstName: 'Harshit',
    lastName: 'Goyal',
    email: 'harshit.goyal@fastcareers.in',
    phone: '+91 98140 99001',
    headline: 'CA Final | Banking & Debt Syndication',
    skills: ['Debt Syndication', 'Working Capital', 'Bank Audit', 'Credit Appraisal'],
    experience: 1,
    hasResumeFile: false, // NO RESUME
    personalDetails: {
      currentCity: 'Ludhiana',
      currentState: 'Punjab',
      currentAddress: 'Civil Lines, Ludhiana',
      gender: 'Male',
      maritalStatus: 'Unmarried',
      dateOfBirth: '1999-12-03',
    },
    caPortfolio: {
      isFresherCA: true,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: false, group1Attempts: '1', group2Attempts: '1', ranker: 'No', completionSessionMonth: 'May', completionSessionYear: '2024' },
      big4Articleship: 'No',
      articleships: [{ firmType: 'Other', firmName: 'Goyal & Associates', city: 'Ludhiana', noOfMonths: '36', noOfPartners: '5' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'No',
      listedCompanyWork: 'No',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'CORRESPONDENCE', courseName: 'B.Com', college: 'Panjab University', yearOfCompletion: '2021', percentage: '78' },
    },
  },
  {
    firstName: 'Meenakshi',
    lastName: 'Sundaram',
    email: 'meenakshi.sundaram@fastcareers.in',
    phone: '+91 98420 10203',
    headline: 'Senior Accountant | Compliance & ERP Migration',
    skills: ['Financial Accounting', 'ERP Implementation', 'Statutory Returns', 'Auditing'],
    experience: 4,
    hasResumeFile: false, // NO RESUME
    personalDetails: {
      currentCity: 'Coimbatore',
      currentState: 'Tamil Nadu',
      currentAddress: 'R.S. Puram, Coimbatore',
      gender: 'Female',
      maritalStatus: 'Married',
      dateOfBirth: '1995-05-19',
    },
    caPortfolio: {
      isFresherCA: false,
      caInter: { bothGroups1stAttempt: true, group1Attempts: '1', group2Attempts: '1', ranker: 'No' },
      caFinal: { bothGroups1stAttempt: false, group1Attempts: '2', group2Attempts: '2', ranker: 'No', completionSessionMonth: 'November', completionSessionYear: '2021' },
      big4Articleship: 'No',
      articleships: [{ firmType: 'Other', firmName: 'Sundaram & Associates', city: 'Coimbatore', noOfMonths: '36', noOfPartners: '4' }],
      gmcsCompleted: 'Yes',
      industrialTrainee: 'No',
      listedCompanyWork: 'No',
    },
    qualifications: {
      graduation: { completed: 'Yes', type: 'REGULAR', courseName: 'B.Com', college: 'PSGR Krishnammal College', yearOfCompletion: '2017', percentage: '83' },
    },
  },
];

const seed20 = async () => {
  try {
    const mongoTarget = process.argv[2] || MONGO_URI;
    console.log(`Connecting to MongoDB at: ${mongoTarget.split('@')[1] || mongoTarget}`);
    await mongoose.connect(mongoTarget, { serverSelectionTimeoutMS: 15000 });
    console.log('MongoDB Connected successfully!');

    const hashedPassword = await bcrypt.hash('Candidate@123', 10);

    const emailListForExcel: Array<{ Email: string; 'Candidate Name': string; 'City': string; 'Has Resume in Portal': string }> = [];

    for (const c of candidateData) {
      let resumeUrl = '';

      if (c.hasResumeFile) {
        const safeName = `resume_${c.firstName.toLowerCase()}_${c.lastName.toLowerCase()}.pdf`;
        resumeUrl = await createProfessionalResume(c, safeName);
        console.log(`✓ Created PDF Resume: ${safeName}`);
      }

      const candidateDoc = {
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email.toLowerCase(),
        password: hashedPassword,
        role: 'candidate',
        phone: c.phone,
        headline: c.headline,
        resumeUrl: resumeUrl || undefined,
        skills: c.skills,
        experience: c.experience,
        personalDetails: c.personalDetails,
        caPortfolio: c.caPortfolio,
        qualifications: c.qualifications,
      };

      await User.findOneAndUpdate(
        { email: c.email.toLowerCase() },
        candidateDoc,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      emailListForExcel.push({
        Email: c.email,
        'Candidate Name': `${c.firstName} ${c.lastName}`,
        'City': c.personalDetails.currentCity,
        'Has Resume in Portal': c.hasResumeFile ? 'Yes' : 'No',
      });
    }

    // Add 3 un-registered test emails in the Excel to test "Not Found" stat
    emailListForExcel.push({
      Email: 'unknown.candidate1@external.com',
      'Candidate Name': 'Unknown Candidate 1',
      'City': 'Mumbai',
      'Has Resume in Portal': 'Not in DB',
    });
    emailListForExcel.push({
      Email: 'notfound.tester@gmail.com',
      'Candidate Name': 'NotFound Tester',
      'City': 'Delhi',
      'Has Resume in Portal': 'Not in DB',
    });
    emailListForExcel.push({
      Email: 'RAHUL.SHARMA@FASTCAREERS.IN', // duplicate casing test
      'Candidate Name': 'Rahul Sharma (Uppercase Duplicate)',
      'City': 'Mumbai',
      'Has Resume in Portal': 'Duplicate',
    });

    // Generate Excel file
    const ws = xlsx.utils.json_to_sheet(emailListForExcel);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Candidates');

    const excelPath = path.join(uploadsDir, 'sample_candidate_emails.xlsx');
    xlsx.writeFile(wb, excelPath);
    console.log(`✓ Generated Test Excel Sheet at: ${excelPath}`);

    // Also copy to frontend public directory so it can be downloaded directly from frontend UI or browser
    const frontendPublicDir = path.join(__dirname, '../../frontend/public');
    if (fs.existsSync(frontendPublicDir)) {
      const publicExcelPath = path.join(frontendPublicDir, 'sample_candidate_emails.xlsx');
      xlsx.writeFile(wb, publicExcelPath);
      console.log(`✓ Copied Test Excel Sheet to frontend/public: ${publicExcelPath}`);
    }

    console.log('\n=============================================');
    console.log('🎉 SUCCESSFULLY SEEDED 20 CANDIDATES & RESUMES!');
    console.log(`• Resumes with PDF files: 16`);
    console.log(`• Candidates without PDF resumes: 4`);
    console.log(`• Sample Excel file created with candidate emails!`);
    console.log('=============================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error: any) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed20();
