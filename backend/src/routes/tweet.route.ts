import asyncHandler from "../utils/asynHandler";
import {Router }from 'express'
import verifyJwt from "../middlewares/authentication.middleware";
import {createTweet , getUserTweet, getRepliesForTweet , replyToTweet, undoReTweet , reTweet , unlikeTweet,likeTweet , getTweetById , deleteTweet , editTweet , getRandomTweets , createReplyForTweet , getReTweets} from '../controllers/tweet.controller'

const tweetRouter = Router()

tweetRouter.post('/create',verifyJwt,asyncHandler(createTweet))
tweetRouter.post('',verifyJwt,asyncHandler(replyToTweet))
tweetRouter.post('/retweet/:id',verifyJwt,asyncHandler(reTweet))
tweetRouter.post('/like/:id',verifyJwt,asyncHandler(likeTweet))
tweetRouter.post('/comment/:id',verifyJwt,asyncHandler(createReplyForTweet))


tweetRouter.get('/all',verifyJwt,asyncHandler(getUserTweet))
tweetRouter.get('/replies/:id',verifyJwt,asyncHandler(getRepliesForTweet))
tweetRouter.get('',verifyJwt,asyncHandler(getTweetById))
tweetRouter.get('/random',verifyJwt,asyncHandler(getRandomTweets))
tweetRouter.get('/getReTweets/:id',verifyJwt,asyncHandler(getReTweets))


tweetRouter.patch('',verifyJwt,asyncHandler(undoReTweet))
tweetRouter.patch('/unlike/:id',verifyJwt,asyncHandler(unlikeTweet))
tweetRouter.patch('',verifyJwt,asyncHandler(editTweet))



tweetRouter.delete('',verifyJwt,asyncHandler(deleteTweet))



export default tweetRouter