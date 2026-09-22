import mongoose from 'mongoose';

const ensureInitialData = async () => {
  try {
    const User = (await import('../models/User')).default;
    const candidateCount = await User.countDocuments({ role: 'candidate' });
    if (candidateCount === 0) {
      console.log('No candidates found in database. Auto-seeding 20 realistic candidate profiles...');
      const { seed20 } = await import('../seed20Candidates');
      await seed20(false);
      console.log('Auto-seed completed successfully!');
    } else {
      console.log(`Verified ${candidateCount} candidates exist in database.`);
    }
  } catch (err) {
    console.error('Error ensuring initial candidate data:', err);
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fastcareers';
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // Auto-seed if empty so candidates are always available on the platform
    ensureInitialData();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`MongoDB Connection Error: ${error.message}`);
    } else {
      console.error(`An unknown error occurred while connecting to MongoDB`);
    }
    // Do not call process.exit(1); keeping the server alive allows health checks and preflight CORS to function
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Retrying connection...');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err.message}`);
});

export default connectDB;
