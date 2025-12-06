import Tweet from "../models/tweet.model";
import logger from "../utils/logger.util";
import { createTweetSchema, editTweetSchema } from "../validation/Tweet.validation";
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import LikeModel from "../models/like.model";
import express from 'express'
import AWSXRay from 'aws-xray-sdk' 

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

const createTweet = async(request:express.Request, response:express.Response ) => {
   try {
    const parsed = createTweetSchema.validate(request.body);
    if(parsed.error){
        logger.error(parsed.error); 
        const erros = parsed.error.details.map((detail) => detail.message)
        return response.status(400).json({
            success : false, 
            message: 'Tweet validation error',
            error : {erros}
        })
    }
    const userId = request.user?._id;
    if(!userId){
        return response.status(400).json({
            message: 'Error finding user',
            success : false
        })
    }
    const content = DOMPurify.sanitize(parsed.value.content)

    const tweet= await Tweet.create({
        author: userId,
        content,
        likeCount: 0,
        replyCount: 0,
        isRetweet: false,
        isReply: false
    })
    return response.status(200).json({
        success: true, 
        message: 'Tweet created successfully', 
        tweet
    })
   } catch (error) {
    logger.error(error)
    return response.status(400).json({
        success: false,
        message: 'Server error'
    })
   }
}

const editTweet = async(request : express.Request, response: express.Response) => {
    const parsed = editTweetSchema.validate(request.body);
    const {tweetId} = request.params; 

    if(parsed.error){
        const errors = parsed.error.details.map((detail) => detail.message)
        logger.error(parsed.error)
        return response.status(401).json({
            success: false,
            message : 'Error editing tweet', 
            error : {errors}
        })
    }
    if(!tweetId){
        return response.status(401).json({
            success: false, 
            message : 'Error finding tweetId'
        })
    }
    const content  = DOMPurify.sanitize(parsed.value.content)
    const userId = request.user?._id
    if(!userId){
        return response.status(401).json({
            success :false, 
            message: 'User id not found'
        })
    }
    const tweet = await Tweet.findById(tweetId);

    if(tweet?.author.toString() !== userId.toString()){
        return response.status(401).json({
            success: false, 
            message: 'You are not owner of this tweet'
        })
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId , {
        content : content
    },{new : true})
    if(!updatedTweet){
        return response.status(401).json({
            success : false, 
            message: 'Error updating tweet'
        })
    }
    return response.status(201).json({
        success : true, 
        message : 'Tweet updated successfully',
        tweet : updatedTweet
    })

}

const deleteTweet = async(request:express.Request, response:express.Response ) => {
    const {tweetId} = request.params; 
    if(!tweetId){
        return response.status(400).json({
            success :false, 
            message : 'Error deleting tweet'
        })
    }
    const tweet = await Tweet.findById(tweetId);
    const userId = request.user?._id
    if(!userId){
        return response.status(401).json({
            success: false, 
            message: 'User id not found '
        })
    }

    if(tweet?.author.toString() !== userId.toString()){
        return response.status(401).json({
            success: false, 
            message : 'You dont have the ownership of this tweet'
        })
    }
    
    await Tweet.findByIdAndDelete(tweetId)
    return response.status(201).json({
        success: true, 
        message : 'Tweet deleted successfully'
    })

}

const getTweetById = async(request:express.Request, response:express.Response ) => {
    const {tweetId} = request.params
    if(!tweetId){
        return response.status(401).json({
            success: false, 
            message: 'Error getting tweetId'
        })
    }
    const tweetInformation = await Tweet.findById(tweetId);
    if(!tweetInformation){
        return response.status(401).json({
            success: false, 
            message: 'Error fetching tweet information'
        })
    }
    return response.status(201).json({
        success: true, 
        message: 'Tweet information fetched successfully', 
        tweet: {tweetInformation}
    })
}

const likeTweet = async(request:express.Request, response:express.Response ) => {
    const {tweetId} = request.params; 
    if(!tweetId){
        return response.status(401).json({
            success :false , 
            message : 'Error getting tweetId' 
        })
    }
    const userId = request.user?._id
    if(!userId){
        return response.status(400).json({
            success: false, 
            message : 'User id not found'
        })
    }
    const alredyLiked = await LikeModel.findOne({userId, tweetId})

    if(alredyLiked){
        return response.status(400).json({
            success: false, 
            message: 'You became like your women liking more than one time cannot do that'
        })
    }
    const like = await LikeModel.create({
        userId: userId, 
        tweetId: tweetId, 
    })
    
    const updatedLikeCount = await Tweet.findByIdAndUpdate(tweetId, {
        $inc: {likeCount: 1}
    }, {new : true})

    if(!updatedLikeCount){
        return response.status(401).json({
            success : false, 
            message : 'Error liking tweet'
        })
    }

    return response.status(201).json({
        success : true, 
        message : 'Tweet liked successfully', 
        tweet : updatedLikeCount
    })  
}

const unlikeTweet = async(request:express.Request, response:express.Response ) => {
    const {tweetId} = request.params; 
    if(!tweetId){
        return response.status(401).json({
            success :false , 
            message : 'Error getting tweetId' 
        })
    }

    const userId = request.user?._id
    if(!userId){
        return response.status(401).json({
            success: false, 
            message: 'User id not found'
        })
    }
    const likedRecord = await LikeModel.findOne({userId, tweetId})

    if(!likedRecord){
        return response.status(401).json({
            success: false, 
            message: 'Stop unlinking me I am not your ex'
        })
    }

    const updatedLikeCount = await Tweet.findByIdAndUpdate(tweetId, {
        $inc: {likeCount: -1}
    }, {new : true})

    if(!updatedLikeCount){
        return response.status(401).json({
            success : false, 
            message : 'Error unliking tweet'
        })
    }

    return response.status(201).json({
        success : true, 
        message : 'Tweet unliked successfully', 
        tweet : updatedLikeCount
    })  
}

const reTweet = async(request:express.Request, response:express.Response ) => {
    const {tweetId} = request.params;
    if(!tweetId){
        return response.status(401).json({
            success : false, 
            message : 'Error getting tweetId'
        })
    }
    const tweetToRetweet = await Tweet.findById(tweetId);
    if(!tweetToRetweet){
        return response.status(401).json({
            success : false, 
            message : 'Error finding tweet to retweet'
        })
    }
    await tweetToRetweet.updateOne({$inc: {retweetCount: 1}})

    const userId = request.user?._id;   

    const reTweet = await Tweet.create({
        author : userId, 
        retweetOf: tweetToRetweet._id, 
        isRetweet : true, 
        likeCount : 0, 
        replyCount : 0, 
        content : ""

    })
    if(!reTweet){
        return response.status(401).json({
            success : false, 
            message : 'Error creating retweet'
        })
    }

    return response.status(201).json({
        success : true, 
        message : 'Retweet created successfully', 
        tweet : reTweet
    })  
}

const undoReTweet = async(request:express.Request, response:express.Response ) => {
    const {tweetId} = request.params;
    if(!tweetId){
        return response.status(401).json({
            success : false, 
            message : 'Error getting tweetId'
        })
    }
    const userId = request.user?._id;  
    const updateReTweetCount = await Tweet.findByIdAndUpdate(tweetId, {
        $inc: {retweetCount : -1}
    }) 
    const deletedRetweet = await Tweet.findOneAndDelete({
        author : userId, 
        retweetOf: tweetId
    })
    if(!deletedRetweet){
        return response.status(401).json({
            success : false, 
            message : 'Error deleting retweet'
        })
    }
    return response.status(201).json({
        success : true, 
        message : 'Retweet deleted successfully', 
    })  
}

const replyToTweet = async(request:express.Request, response:express.Response ) => {
    const {tweetId} = request.params;
    const parsed  = editTweetSchema.validate(request.body)
    
    if(!tweetId){
        return response.status(401).json({
            success : false, 
            message : 'Error getting tweetId'
        })
    }

    if(parsed.error){
        const errors = parsed.error.details.map((detail) => detail.message)
        return response.status(401).json({
            success: false,
            message: 'Validation error',
            error: {errors}
        })
    }

    const userId = request.user?._id
    if(!userId){
        return response.status(401).json({
            success:false, 
            message: 'Error finding author'
        })
    }

    const originalTweet = await Tweet.findById(tweetId)
    if(!originalTweet){
        return response.status(401).json({
            success: false, 
            message: 'Error finding original tweet'
        })
    }

    const content = DOMPurify.sanitize(parsed.value.content)

    const replyToTweet = await Tweet.create({
        author: userId,
        content: content,
        likeCount : 0,
        replyCount : 0, 
        isReply : true , 
        replyTo: originalTweet?._id
    })

    await Tweet.findByIdAndUpdate(tweetId, {
        $inc: {replyCount: 1}
    })
    if(!replyToTweet){
        return response.status(401).json({
            sucess: false, 
            message: 'Error replying to tweet'
        })
    }
    return response.status(201).json({
        success: true, 
        message: 'Replied to tweet',
        repliedTweet: {replyToTweet}
    })
}

const getRepliesForTweet = async(request:express.Request, response:express.Response ) => {
    const {tweetId} = request.params;
    if(!tweetId){
        return response.status(401).json({
            success : false, 
            message : 'Error getting tweetId'
        })
    }

    const replies = await Tweet.find({
        isReply : true, 
        replyTo : tweetId
    })

    return response.status(201).json({
        success : true, 
        message : 'Replies fetched successfully', 
        replies
    })  
}

const getUserTweet = async(request:express.Request, response:express.Response ) => {

    const segment = AWSXRay.getSegment()

    const userId = request.user?._id;
    if(!userId){
        return response.status(401).json({
            success : false, 
            message : 'Error finding userId'
        })
    }

    const subSegment1 = segment?.addNewSubsegment('db-user-tweets')

    const userTweets = await Tweet.find({
        author : userId
    })

    if(!userTweets){
        subSegment1?.addError('User tweet error')
        return response.status(400).json({
            success: false, 
            message: 'Error fetching user tweets'
        })
    }
    subSegment1?.close()
    return response.status(201).json({
        success : true, 
        message : 'User tweets fetched successfully', 
        tweets : {userTweets}
    });
}


const getRandomTweets = async (request: express.Request, response: express.Response) => {
  const currentUser = request.user?._id;


  const segment = AWSXRay.getSegment()

  const subSegment1 = segment?.addNewSubsegment('db-three-random-tweet')

  const tweets = await Tweet.aggregate([
    { $match: { author: { $ne: currentUser } } },
    { $sample: { size: 3 } },

    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "user"
      }
    },

    { $unwind: "$user" },

    {
      $project: {
        _id: 1,
        content: 1,
        createdAt: 1,
        firstName: "$user.firstName",
        lastName: "$user.lastName",
        username: "$user.username",
        userId: "$user._id"
      }
    }
  ]);

  if(!tweets){
    subSegment1?.addError('Fetching error')
    return response.status(400).json({
        success: false, 
        message: 'Either db is empty or Server error'
    })
  }

  subSegment1?.close()

  return response
  .status(201)
  .json(
    { 
        success: true,
        message  : "Founded three random tweet",
        tweet : {tweets}
    }
        )
};



export {createTweet , getUserTweet, getRepliesForTweet , replyToTweet, undoReTweet , reTweet , unlikeTweet,likeTweet , getTweetById , deleteTweet , editTweet , getRandomTweets}