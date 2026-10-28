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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("./models/User"));
const dns_1 = __importDefault(require("dns"));
// Fix for local DNS issues with SRV records
dns_1.default.setServers(['8.8.8.8', '1.1.1.1']);
const MONGO_URI = 'mongodb+srv://divyanshyadav10270_db_user:j14BaPbi0ot7eAOo@cluster0.yz9opfv.mongodb.net/workpulse?retryWrites=true&w=majority';
const generateData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(MONGO_URI);
        console.log('MongoDB Connected to Live Database');
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash('123456', salt);
        const candidates = [];
        const timestamp = Date.now();
        for (let i = 1; i <= 50; i++) {
            const isExperienced = i <= 10;
            candidates.push({
                firstName: `TestCandidate${i}`,
                lastName: `Doe${i}`,
                email: `candidate${timestamp}_${i}@example.com`,
                password: hashedPassword,
                role: 'candidate',
                phone: `98765432${i.toString().padStart(2, '0')}`,
                headline: isExperienced ? 'Experienced CA with great skills' : 'Fresher CA looking for opportunities',
                resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                skills: ['Accounting', 'Taxation', 'Audit', 'Finance'],
                experience: isExperienced ? Math.floor(Math.random() * 5) + 1 : 0,
                personalDetails: {
                    alternatePhone: `98765431${i.toString().padStart(2, '0')}`,
                    currentAddress: `123 Main St, Apt ${i}`,
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
                            firmName: `Audit Firm ${i}`,
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
                    currentCompanyName: `Company ABC ${i}`,
                    currentCTC: '800000',
                    expectedCTC: '1200000',
                    currentDesignation: 'Senior Auditor',
                    workProfile: 'Statutory Audit'
                } : undefined
            });
        }
        yield User_1.default.insertMany(candidates);
        console.log('50 candidates added successfully to LIVE DB!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding candidates:', error);
        process.exit(1);
    }
});
generateData();
