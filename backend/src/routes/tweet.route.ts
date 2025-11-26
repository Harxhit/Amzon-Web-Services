import asyncHandler from "../utils/asynHandler";
import {Router }from 'express'
import verifyJwt from "../middlewares/authentication.middleware";
import {createTweet , getUserTweet, getRepliesForTweet , replyToTweet, undoReTweet , reTweet , unlikeTweet,likeTweet , getTweetById , deleteTweet , editTweet , getRandomTweets} from '../controllers/tweet.controller'

const tweetRouter = Router()

tweetRouter.post('/create',verifyJwt,asyncHandler(createTweet))

tweetRouter.get('/all',verifyJwt,asyncHandler(getUserTweet))

tweetRouter.get('',verifyJwt,asyncHandler(getRepliesForTweet))

tweetRouter.post('',verifyJwt,asyncHandler(replyToTweet))

tweetRouter.patch('',verifyJwt,asyncHandler(undoReTweet))

tweetRouter.post('',verifyJwt,asyncHandler(reTweet))

tweetRouter.patch('',verifyJwt,asyncHandler(unlikeTweet))

tweetRouter.post('',verifyJwt,asyncHandler(likeTweet))

tweetRouter.get('',verifyJwt,asyncHandler(getTweetById))

tweetRouter.delete('',verifyJwt,asyncHandler(deleteTweet))

tweetRouter.patch('',verifyJwt,asyncHandler(editTweet))

tweetRouter.get('/random',verifyJwt,asyncHandler(getRandomTweets))


export default tweetRouter