import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MOCK_RESUME_URL = 'http://res.cloudinary.com/demo/image/upload/v1312461204/sample.pdf';

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Diya', 'Ananya', 'Aadhya', 'Kavya', 'Avni', 'Riya', 'Saanvi', 'Myra', 'Isha', 'Aarohi'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Das', 'Joshi', 'Yadav', 'Mishra'];
const cities = ['Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad', 'Chennai'];
const states = ['Maharashtra', 'Delhi', 'Maharashtra', 'Karnataka', 'Telangana', 'Tamil Nadu'];
const courses = ['B.Com', 'BBA', 'CA Final', 'CA Inter', 'MBA', 'M.Com'];

const seedCandidates = async () => {
  try {
    console.log('Connecting to MongoDB...', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fastcareer');
    console.log('Connected!');

    const candidatesToInsert = [];

    for (let i = 0; i < 50; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const cityIndex = Math.floor(Math.random() * cities.length);
      const course = courses[Math.floor(Math.random() * courses.length)];

      candidatesToInsert.push({
        firstName,
        lastName,
        email: `candidate${i}_${Date.now()}@example.com`,
        password: 'Password123!', // Hashed via pre-save hook? If we use User.create, it might trigger. Or we just provide simple plain text and let hook hash it.
        role: 'candidate',
        resumeUrl: MOCK_RESUME_URL,
        personalDetails: {
          currentCity: cities[cityIndex],
          currentState: states[cityIndex],
        },
        qualifications: {
          graduation: {
            courseName: course,
            collegeName: 'XYZ University',
            yearOfCompletion: String(2018 + Math.floor(Math.random() * 6)), // 2018-2023
          }
        }
      });
    }

    console.log(`Inserting 50 candidates...`);
    // Need to save them individually if we want pre-save hooks (like password hash) to run
    for (const candidateData of candidatesToInsert) {
      const candidate = new User(candidateData);
      await candidate.save();
    }
    
    console.log('Successfully seeded 50 candidates!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedCandidates();
