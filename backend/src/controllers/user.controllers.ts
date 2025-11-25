import User,{ UserDocument } from '../models/user.model';
import logger from '../utils/logger.util';
import { Request, Response } from 'express';
import Joi from 'joi'
import signUpSchema from '../validation/SignUp.validation';

interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

const generateAccessTokenAndRefreshToken = async (
  userId: string,
): Promise<{ accessToken: string; refreshToken: string }> => {
  const user = await User.findById(userId);

  if (!user) {
   logger.error('User not found');
   throw new Error('User not found')
  }
  const accessToken = await user?.generateAccessToken();
  const refreshToken = await user?.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user?.save({ validateBeforeSave: false });
  return { accessToken , refreshToken};
};

const signUp = async (request: Request, response: Response) => {
  // console.log('Request body' ,request.body)
  const { error, value } = signUpSchema.validate(request.body);

  if (error) {
    console.log(error)
    const errors  = error.details.map((detail) => detail.message)
    return response.status(400).json({
      success : false , 
      data: {
        error : {errors}
      }, 
      message : "Validation error"
    })
  }

  const { username, email, password, firstName, lastName} =
    value;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    logger.warn('User already exists with this email or username');
    return response.status(400).json({
      success : false, 
      message: 'User already exist'
    })
  }
 
  // Create user
  const user = await User.create({
    username,
    email,
    password,
    firstName,
    lastName,
  });


  if (!user) {
    logger.error('User creation failed');
    return response.status(400).json({
      success: false, 
      message: "Error creating a new user"
    })
  }

  logger.info('User successfully created', { userId: user._id });

  const {accessToken, refreshToken}  =  await generateAccessTokenAndRefreshToken(user?._id as any) 

   response.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  return response.status(200).json({
    success: true,
    data: {
      user: {
        id: user?._id,
        username: user?.username,
        firstName: user?.firstName, 
        lastName : user?.lastName, 
        email: user?.email,
        isActive: user?.isActive,
      },
    },
    message: 'User logged in successfully',
  });
};

const signIn = async (request: Request, response: Response) => {
  // console.log('Request'  , request.body)
  const { username, email, password } = request.body;

  if (!username &&  !email) {
    logger.error("Username or Email is required")
    return response.status(400).json({
      success : false ,
      message : 'User or Email is required'
    })
  }

  if (!password) {
    logger.error('Password is required')
    return response.status(400).json({
      success : false, 
      message : 'Password is required'
    })
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  
  if(!user){
    logger.error('User not found with the email or username')
    return response.status(400).json({
      success : false, 
      message: 'User not registered with email or username'
    })
  }
  
  
  //Check password
  const isPasswordValid = await user?.isPasswordCorrect(password);
  if (!isPasswordValid) {
    logger.error('Incorrect password');
    return response.status(400).json({
      success: false, 
      message : "Incorrect password"
    })
  }
  
    
  //Mark user as active
 if (user) {
  user.isActive = true;
  await user.save({ validateBeforeSave: false });
}

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user?._id as any);

  response.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: false,  
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
  
  return response.status(200).json({
    success: true,
    data: {
      user: {
        id: user?._id,
        username: user?.username,
        firstName: user?.firstName, 
        lastName : user?.lastName, 
        email: user?.email,
        isActive: user?.isActive,
      },
    },
    message: 'User logged in successfully',
  });
};

const signOut = async(request : AuthenticatedRequest , response : Response) => {
    const userId  = request.user?._id; 

    if(!userId){
        logger.error('User not found')
    }

    await User.findByIdAndUpdate(
        userId , 
        {
            refreshToken: "", 
            isActive : false, 
            updatedAt: Date.now()
        }, 
        {new: true}
    )

    response.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  });
  
  response.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
}

const updateProfileDetails = async(request: AuthenticatedRequest , response: Response) => {
    const updateSchema = Joi.object({
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        email: Joi.string().optional()
    })
    
    const {error, value} = updateSchema.validate(request.body)

    const userId = request.user?._id

    if(error){
        logger.error('Validation error')
        return response.json({
            success: false, 
            message : error.message
        })
    }

    const updateUser = await User.findByIdAndUpdate(
       userId, 
       value, 
       {new : true}
    )

    return response.status(201).json({
        success : true, 
        message : 'User details updated successfully'
       
    })
}


const changePassword = async (
  request: AuthenticatedRequest,
  response: Response,
) => {
  const schema = Joi.object({
    oldPassword: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      .required()
      .messages({
        'string.empty': 'Old password is required',
        'string.min': 'Old password must be at least 8 characters long',
        'string.max': 'Old password must not exceed 128 characters',
        'string.pattern.base':
          'Old password must contain uppercase, lowercase, number, and special character',
      }),
    newPassword: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      .required()
      .messages({
        'string.empty': 'New password is required',
        'string.min': 'New password must be at least 8 characters long',
        'string.max': 'New password must not exceed 128 characters',
        'string.pattern.base':
          'New password must contain uppercase, lowercase, number, and special character',
      }),
  });

  const { error, value } = schema.validate(request.body);

  if (error) {
    logger.error('Validation error', {
      message: error.message,
      stack: error.stack,
    });
  }

  const { oldPassword, newPassword } = value;
  const userId = request.user?._id;

  if (!userId) {
    logger.error('User ID missing from request');
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      logger.error('User not found');
      throw new Error('User not found')
    }

    const isMatch = await user?.isPasswordCorrect(oldPassword);
    if (!isMatch) {
      logger.error('Old password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return response.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (err) {
    logger.error('Error while changing password');
  }
}


const getRandomUserForTweet = async(request: Request , response:Response) => {
  try {
    const users = await User.aggregate(
      [
        {
          $sample: {
            size: 3
          }
        },
        {
          $project:{
            _id:1, 
            firstName:1,
            lastName:1,
            username:1,
          }
        }
      ]
    )
    response.status(200).json({
      success: true, 
      message : 'Users fetched successfully',
      data : {users}
    })
  } catch (error) {
    console.error(error)
    logger.error('Server error')
    response.status(400).json({
      success: false, 
      message : 'Error fetching user'
    })
  }
}


export {signIn , signOut , signUp , updateProfileDetails , changePassword , getRandomUserForTweet}