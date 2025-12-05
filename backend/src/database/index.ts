import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger.util';

dotenv.config();

const connectToDataBase = async () => {
  const connectionString = process.env.DATABASE_URL;
  // console.log('Connection String',connectionString)
  if (!connectionString) {
    throw new Error('Database url is not defined in the environment variables');
  }

  try {
    const connection = await mongoose.connect(connectionString);
    logger.info(
      'MongoDB connected successfully',
      ` DB Host: ${connection.connection.host}`,
    );
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectToDataBase;