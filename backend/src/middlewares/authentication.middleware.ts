import jwt from 'jsonwebtoken';
import logger from '../utils/logger.util';
import dotenv from 'dotenv';
import User , {UserDocument} from '../models/user.model'
import express from 'express'
import { NextFunction } from 'express';

dotenv.config();


interface jwtPayload {
  _id: string;
}

const verifyJwt = async (
  request: express.Request,
  response: express.Response,
  next: NextFunction,
) => {
  try {
  const authHeader = request.header('Authorization');

  const token =
    request.cookies?.accessToken ||
    request.body?.accessToken ||
    (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

  if (!token) {
    logger.warn('Token not found');
  }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwtPayload;

    const user = await User.findById(decoded._id).select('-refreshToken');

    if (!user) {
      logger.error(`User not found decoded id : ${decoded._id}`);
      throw new Error('User does not exist')
    }

    request.user = user
    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('Authentication failed', {
        message: error.message,
        stack: error.stack,
      });
    }
  }
};

export default verifyJwt