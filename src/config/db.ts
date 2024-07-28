import mongoose from 'mongoose';

const connectDB = async () => {
  const dbUri = process.env.MONGODB_URI;

  if (!dbUri) {
    throw new Error('MongoDB URI is not defined in the environment variables.');
  }

  try {
    await mongoose.connect(dbUri, {});
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
