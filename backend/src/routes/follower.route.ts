import {Router} from 'express'
import asyncHandler from '../utils/asynHandler'
import { followUser , unFollowUser , getFollower} from '../controllers/follower.controller'
import verifyJwt from '../middlewares/authentication.middleware'


const followerRouter = Router()

followerRouter.route('/follow/:id').post(verifyJwt, asyncHandler(followUser))

followerRouter.route('/unfollow/:id').delete(verifyJwt, asyncHandler(unFollowUser))

followerRouter.route('/following').get(verifyJwt, asyncHandler(getFollower));


export default followerRouter