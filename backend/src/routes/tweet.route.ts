import asyncHandler from "../utils/asynHandler";
import {Router }from 'express'
import verifyJwt from "../middlewares/authentication.middleware";
import {createTweet , getUserTweet, getRepliesForTweet , replyToTweet, undoReTweet , reTweet , unlikeTweet,likeTweet , getTweetById , deleteTweet , editTweet , getRandomTweets , createReplyForTweet} from '../controllers/tweet.controller'
import { create } from "domain";

const tweetRouter = Router()

tweetRouter.post('/create',verifyJwt,asyncHandler(createTweet))

tweetRouter.get('/all',verifyJwt,asyncHandler(getUserTweet))

tweetRouter.get('/replies/:id',verifyJwt,asyncHandler(getRepliesForTweet))

tweetRouter.post('',verifyJwt,asyncHandler(replyToTweet))

tweetRouter.patch('',verifyJwt,asyncHandler(undoReTweet))

tweetRouter.post('',verifyJwt,asyncHandler(reTweet))

tweetRouter.patch('/unlike/:id',verifyJwt,asyncHandler(unlikeTweet))

tweetRouter.post('/like/:id',verifyJwt,asyncHandler(likeTweet))

tweetRouter.get('',verifyJwt,asyncHandler(getTweetById))

tweetRouter.delete('',verifyJwt,asyncHandler(deleteTweet))

tweetRouter.patch('',verifyJwt,asyncHandler(editTweet))

tweetRouter.get('/random',verifyJwt,asyncHandler(getRandomTweets))

tweetRouter.post('/comment/:id',verifyJwt,asyncHandler(createReplyForTweet))




export default tweetRouter