import {Router} from  'express'
import { signUp , signIn , signOut , updateProfileDetails , getRandomUserForTweet } from '../controllers/user.controllers'
import verifyJwt from '../middlewares/authentication.middleware'

const userRouter = Router()

//Route for sign-up
userRouter.route('/sign-up').post(signUp)

//Route for sign-in
userRouter.route('/sign-in').post(signIn)

//Route for sign-out
userRouter.route('/sign-out').post(verifyJwt,signOut)

//Route for update user details
userRouter.route('/update').patch(verifyJwt,updateProfileDetails)

//Route to get random for user Tweets
userRouter.route('/tweet').get(verifyJwt,getRandomUserForTweet)


export default userRouter