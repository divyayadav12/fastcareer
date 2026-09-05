import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fastcareers';
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
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
