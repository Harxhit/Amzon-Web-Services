import {Router} from  'express'
import { signUp , signIn, getUserById , signOut , updateProfileDetails , getRandomUserForTweet , messageSearchQuery} from '../controllers/user.controllers'
import verifyJwt from '../middlewares/authentication.middleware'
import asyncHandler from '../utils/asynHandler'
import rateLimit from 'express-rate-limit'

const userRouter = Router()

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,  
    max: 10,                  
    message: "Too many login attempts"
});

const signUpLimiter = rateLimit({
     windowMs: 5 * 60 * 1000,  
    max: 10,                  
    message: "Too many sign-up attempts"
})


//Route for sign-up
userRouter.route('/sign-up').post(signUpLimiter,asyncHandler(signUp))

//Route for sign-in
userRouter.route('/sign-in').post(loginLimiter ,asyncHandler(signIn))

//Route for sign-out
userRouter.route('/sign-out').post(verifyJwt,asyncHandler(signOut))

//Route for update user details
userRouter.route('/update').patch(verifyJwt,asyncHandler(updateProfileDetails))

//Route to get random for user Tweets
userRouter.route('/tweet').get(verifyJwt,asyncHandler(getRandomUserForTweet))

userRouter.route('/search').get( verifyJwt , asyncHandler(messageSearchQuery))

userRouter.route('/details/:id').get( verifyJwt , asyncHandler(getUserById))



export default userRouter