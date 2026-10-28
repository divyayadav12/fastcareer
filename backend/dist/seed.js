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
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const User_1 = __importDefault(require("./models/User"));
const pdfkit_1 = __importDefault(require("pdfkit"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fastcareers';
const generateDummyPDF = (filename, content) => {
    return new Promise((resolve, reject) => {
        const uploadsDir = path_1.default.join(__dirname, '..', 'uploads');
        if (!fs_1.default.existsSync(uploadsDir)) {
            fs_1.default.mkdirSync(uploadsDir, { recursive: true });
        }
        const filePath = path_1.default.join(uploadsDir, filename);
        const doc = new pdfkit_1.default();
        const stream = fs_1.default.createWriteStream(filePath);
        doc.pipe(stream);
        doc.fontSize(25).text(`Resume for ${content}`, 100, 100);
        doc.fontSize(12).text(`This is a dummy PDF file generated for testing the bulk download feature.`, 100, 150);
        doc.end();
        stream.on('finish', () => resolve());
        stream.on('error', reject);
    });
};
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(MONGO_URI);
        console.log('Connected to MongoDB');
        // Clear old candidates
        yield User_1.default.deleteMany({ firstName: 'TestCandidate' });
        console.log('Cleared old test candidates');
        const hashedPassword = yield bcrypt_1.default.hash('password123', 10);
        const candidates = [];
        for (let i = 1; i <= 100; i++) {
            const fileName = `resume_candidate_${i}.pdf`;
            yield generateDummyPDF(fileName, `Candidate ${i}`);
            candidates.push({
                firstName: `TestCandidate`,
                lastName: `${i}`,
                email: `candidate${i}@example.com`,
                password: hashedPassword,
                role: 'candidate',
                resumeUrl: `/uploads/${fileName}`,
                address: {
                    city: `Test City ${i}`,
                    state: `State ${i % 10}`
                },
                education: [{
                        degree: 'B.Tech',
                        institution: `Test University ${i}`,
                        passingYear: `${2010 + (i % 10)}`
                    }]
            });
        }
        yield User_1.default.insertMany(candidates);
        console.log('Successfully seeded 100 candidates with dummy PDFs');
        mongoose_1.default.disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
});
seedDatabase();
