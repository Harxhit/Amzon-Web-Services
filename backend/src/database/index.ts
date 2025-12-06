import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger.util';

dotenv.config();

const connectToDataBase = async () => {
  logger.info('Connecting to MongoDB...');
  const connectionString = process.env.DATABASE_URL;
  // console.log('Connection String',connectionString)
  if (!connectionString) {
    logger.error('Database URL is not defined in the environment variables');
    throw new Error('Database url is not defined in the environment variables');
  }

  try {
    const connection = await mongoose.connect(connectionString);
    logger.info(
      'MongoDB connected successfully',
      ` DB Host: ${connection.connection.host}`,
    );
  } catch (error:any) {
    logger.error('MongoDB connection error:', {
      meta: {
        message: error.message,
      }
    });
    process.exit(1);
  }
};

export default connectToDataBase;