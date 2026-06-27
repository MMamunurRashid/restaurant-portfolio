import mongoose from 'mongoose';
import config from '../config';

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!config.DB_URL) {
    throw new Error('DB_URL is not configured');
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(config.DB_URL, {
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    return await connectionPromise;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
};
