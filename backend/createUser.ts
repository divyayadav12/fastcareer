import mongoose from 'mongoose';
import User from './src/models/User';
import dotenv from 'dotenv';

dotenv.config();

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fastcareer');
    const existing = await User.findOne({ email: 'princesharwma@gmail.com' });
    if (existing) {
      console.log('User already exists, updating password to password123');
      existing.password = 'password123';
      await existing.save();
    } else {
      console.log('Creating user...');
      await User.create({
        firstName: 'Prince',
        lastName: 'Sharma',
        email: 'princesharwma@gmail.com',
        password: 'password123',
        role: 'candidate',
      });
      console.log('User created successfully. password: password123');
    }
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

createUser();
