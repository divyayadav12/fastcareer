import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fastcareers';

const generateData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const candidates = [];
    
    for (let i = 1; i <= 50; i++) {
      const isExperienced = i <= 10;
      
      candidates.push({
        firstName: "TestCandidate",
        lastName: "Doe",
        email: "candidate@example.com",
        password: hashedPassword,
        role: 'candidate',
        phone: "98765432",
        headline: isExperienced ? 'Experienced CA with great skills' : 'Fresher CA looking for opportunities',
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        skills: ['Accounting', 'Taxation', 'Audit', 'Finance'],
        experience: isExperienced ? Math.floor(Math.random() * 5) + 1 : 0,
        personalDetails: {
          alternatePhone: "98765431",
          currentAddress: "123 Main St, Apt ",
          currentState: 'Maharashtra',
          currentCity: 'Mumbai',
          permanentAddressSameAsCurrent: true,
          dateOfBirth: '1995-05-15',
          gender: i % 2 === 0 ? 'Female' : 'Male',
          maritalStatus: 'Unmarried',
          preferredCampusCity: 'Delhi'
        },
        caPortfolio: {
          isFresherCA: !isExperienced,
          caInter: {
            bothGroups1stAttempt: i % 3 === 0,
            group1Attempts: '1',
            group1Month: 'May',
            group1Year: '2018',
            group2Attempts: '1',
            group2Month: 'Nov',
            group2Year: '2018',
            ranker: i % 5 === 0 ? 'Yes' : 'No',
            completionSessionMonth: 'Nov',
            completionSessionYear: '2018',
            percentage: '65'
          },
          caFinal: {
            bothGroups1stAttempt: i % 4 === 0,
            group1Attempts: '1',
            group1Month: 'May',
            group1Year: '2021',
            group2Attempts: '2',
            group2Month: 'Nov',
            group2Year: '2021',
            ranker: 'No',
            completionSessionMonth: 'Nov',
            completionSessionYear: '2021',
            percentage: '55'
          },
          articleships: [
            {
              type: 'Statutory Audit',
              firmType: 'Mid Size',
              firmName: "Audit Firm ",
              city: 'Pune',
              noOfPartners: '5',
              noOfMonths: '36'
            }
          ],
          articleshipCompletionDate: '2021-04-30',
          gmcsCompleted: 'Yes',
          big4Articleship: i % 6 === 0 ? 'Yes' : 'No',
          industrialTrainee: 'No',
          listedCompanyWork: 'No',
          natureOfWork: 'Audit'
        },
        qualifications: {
          graduation: {
            completed: 'Yes',
            yearOfCompletion: '2016',
            percentage: '75',
            college: 'Delhi University',
            type: 'REGULAR'
          },
          class12: {
            percentage: '85',
            year: '2013',
            board: 'CBSE'
          },
          class10: {
            percentage: '90',
            year: '2011',
            board: 'CBSE'
          }
        },
        experienceInfo: isExperienced ? {
          isExperienced: true,
          experienceYears: String(Math.floor(Math.random() * 5) + 1),
          currentCompanyName: "Company ABC ",
          currentCTC: '800000',
          expectedCTC: '1200000',
          currentDesignation: 'Senior Auditor',
          workProfile: 'Statutory Audit'
        } : undefined
      });
    }

    await User.insertMany(candidates);
    console.log('50 candidates added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding candidates:', error);
    process.exit(1);
  }
};

generateData();
