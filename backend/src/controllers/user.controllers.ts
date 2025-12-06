import User,{ UserDocument } from '../models/user.model';
import logger from '../utils/logger.util';
import express,  { Request, Response } from 'express';
import Joi from 'joi'
import { signUpSchema , loginSchema } from '../validation/auth.validation';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import AWSXRay, { getSegment } from 'aws-xray-sdk'
import { access } from 'fs';

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)



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

const signUp = async (request: express.Request, response: express.Response) => {
  // console.log('express.Request body' ,request.body)
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
  const username = DOMPurify.sanitize(value.username)
  const firstName = DOMPurify.sanitize(value.firstName)
  const lastName = DOMPurify.sanitize(value.lastName)
  const email = DOMPurify.sanitize(value.email)
  const password = DOMPurify.sanitize(value.password)


  const segment = AWSXRay.getSegment()


  const subSegment1 = segment?.addNewSubsegment('db-get-existing-user')

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });


  
  if (existingUser) {
    subSegment1?.addError('User already exists')
    logger.warn('User already exists with this email or username');
    return response.status(400).json({
      success : false, 
      message: 'User already exist'
    })
  }
  
  subSegment1?.close()
  

  const subSegment2 = segment?.addNewSubsegment('db-create-user')
  
  // Create user
  const user = await User.create({
    username,
    email,
    password,
    firstName,
    lastName,
  });


  if (!user) {
    subSegment2?.addError('User creation failed')
    logger.error('User creation failed');
    return response.status(400).json({
      success: false, 
      message: "Error creating a new user"
    })
  }

  subSegment2?.addMetadata("userId",user._id)
  subSegment2?.close()

  logger.info('User successfully created', { userId: user._id });


  const subSegment3 = segment?.addNewSubsegment('jwt-tokens')

  const {accessToken, refreshToken}  =  await generateAccessTokenAndRefreshToken(user?._id as any) 

  if(!accessToken && !refreshToken){
    subSegment3?.addError('Error in access token')
    logger.error('Error creating sub segment')
    return response.status(400).json({
      success : false, 
      message: 'Error creating access token and refresh token'
    })
  }
  subSegment3?.close()

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

const signIn = async (request: express.Request, response: express.Response) => {
  // console.log('express.Request'  , request.body)
  const {error , value} = loginSchema.validate(request.body)

  if(error){
    logger.error(error)
    const errors  = error.details.map((detail) => detail.message)
    return response.status(401).json({
      success: false,
      message : 'Validation error',
      error  : {error}
    })
  }

  const username = DOMPurify.sanitize(value.username)
  const email = DOMPurify.sanitize(value.email)
  const password = DOMPurify.sanitize(value.password)
  

  const segment = AWSXRay.getSegment()

  const subSegment1 = segment?.addNewSubsegment('db-finding-user')

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  
  if(!user){
    subSegment1?.addError('User not found')
    logger.error('User not found with the email or username')
    return response.status(400).json({
      success : false, 
      message: 'User not registered with email or username'
    })
  } 

  subSegment1?.close()
  


  const subSegment2 = segment?.addNewSubsegment('password-check')
  //Check password
  const isPasswordValid = await user?.isPasswordCorrect(password);
  if (!isPasswordValid) {
    subSegment2?.addError('Incorrect password')
    logger.error('Incorrect password');
    return response.status(400).json({
      success: false, 
      message : "Incorrect password"
    })
  }
  
  subSegment2?.close()
    
  //Mark user as active
 if (user) {
  user.isActive = true;
  await user.save({ validateBeforeSave: false });
  }
  const subSegment3 = segment?.addNewSubsegment('jwt-token')

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user?._id as any);

  if(!accessToken && !refreshToken){
    subSegment3?.addError('Error refresh and access token')
    return response.status(400).json({
      success: false, 
      message: 'Error creating refresh and access token'
    })
  }

  response.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: false,  
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });


  subSegment3?.close()

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
        createdAt: user?.createdAt
      },
    },
    message: 'User logged in successfully',
  });
};

const signOut = async(request : express.Request, response : express.Response) => {
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

const updateProfileDetails = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const updateSchema = Joi.object({
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      email: Joi.string().optional(),
    });

    const { error, value } = updateSchema.validate(request.body);
    if (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const userId = request.user?._id;
    if (!userId) {
      return response.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const updateData = {
      firstName: value.firstName ? DOMPurify.sanitize(value.firstName) : undefined,
      lastName: value.lastName ? DOMPurify.sanitize(value.lastName) : undefined,
      email: value.email ? DOMPurify.sanitize(value.email) : undefined,
    };

    await User.findByIdAndUpdate(userId, updateData, { new: true });

    return response.status(200).json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (err) {
    logger.error(err);
    return response.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};


const changePassword = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const schema = Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
    });

    const { error, value } = schema.validate(request.body);
    if (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const { oldPassword, newPassword } = value;
    const userId = request.user?._id;

    if (!userId) {
      return response.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isMatch = await user.isPasswordCorrect(oldPassword);
    if (!isMatch) {
      return response.status(400).json({
        success: false,
        message: 'Old password incorrect',
      });
    }

    if (oldPassword === newPassword) {
      return response.status(400).json({
        success: false,
        message: 'New password cannot be the same as old password',
      });
    }

    user.password = newPassword;
    await user.save();

    return response.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (err) {
    logger.error(err);
    return response.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};


const getRandomUserForTweet = async (request: express.Request, response: express.Response) => {
  try {
    const loggedUser = request.user?._id;

    const users = await User.aggregate([
      { $match: { _id: { $ne: loggedUser } } },
      { $sample: { size: 3 } },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          username: 1,
        },
      },
    ]);

    return response.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      users,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Server error fetching users',
    });
  }
};

const messageSearchQuery = async (request: express.Request, response: express.Response) => {
  console.log("Search query hit:", request.query.query);
  const sanitizeQuery = (text: string) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  try {
    const segment = AWSXRay.getSegment()

    const subSegment1 = segment?.addNewSubsegment('chat-message-searchBar')
    
    const rawQuery = (request.query.query as string) || "";
    const query = sanitizeQuery(rawQuery).trim().toLowerCase();
    
    if (!query) {
      subSegment1?.addError('Query error')
      return response.status(200).json({
        success: true,
        results: []
      });
    }

    subSegment1?.close()
    


    const subSegment2 = segment?.addNewSubsegment('db-seach-results')

    const results = await User.find({
      _id:{$ne : request.user?._id},
      $or: [
        { username: { $regex: query, $options: "i" } },
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
      ]
    })
      .select("firstName lastName username _id")
      .limit(10);

    if(!results){
      subSegment2?.addError('Error fetching results')
    }

    subSegment2?.close()

    return response.status(200).json({
      success: true,
      results
    });

  } catch (error: any) {
    logger.error(error);
    return response.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const getUserById = async(request:express.Request, response:express.Response) => {

  const segment = AWSXRay.getSegment()

  const userId = request.params.id;
  if(!userId){
    return response.status(400).json({
      success: false, 
      message: 'Id not came frontend'
    })
  }
  const subSegment1= segment?.addNewSubsegment('db-user')

  const userDetails = await User.findById(userId).select('firstName lastName username _id')
  if(!userDetails){
    subSegment1?.addError('Error fetching details')
    return response.status(400).json({
      success : false, 
      message : 'Server error'
    })
  }

  subSegment1?.close()
  
  return response.status(201).json({
    success: true, 
    message: 'User details fetched successfully',
    userDetails
  })
}



export {signIn , signOut , signUp , updateProfileDetails , changePassword , getRandomUserForTweet ,messageSearchQuery , getUserById}
