import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import User from './models/User';
import PDFDocument from 'pdfkit';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fastcareers';

const generateDummyPDF = (filename: string, content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filePath = path.join(uploadsDir, filename);
    
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    
    doc.pipe(stream);
    doc.fontSize(25).text(`Resume for ${content}`, 100, 100);
    doc.fontSize(12).text(`This is a dummy PDF file generated for testing the bulk download feature.`, 100, 150);
    doc.end();
    
    stream.on('finish', () => resolve());
    stream.on('error', reject);
  });
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear old candidates
    await User.deleteMany({ firstName: 'TestCandidate' });
    console.log('Cleared old test candidates');

    const hashedPassword = await bcrypt.hash('password123', 10);
    const candidates = [];

    for (let i = 1; i <= 100; i++) {
      const fileName = `resume_candidate_${i}.pdf`;
      await generateDummyPDF(fileName, `Candidate ${i}`);
      
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

    await User.insertMany(candidates);
    console.log('Successfully seeded 100 candidates with dummy PDFs');
    
    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
