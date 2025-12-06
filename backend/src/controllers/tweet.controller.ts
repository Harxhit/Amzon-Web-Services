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
    logger.info('Creating tweet',{
        meta: {
            user: request.user?._id,
             route: request.originalUrl
            }
    })   
    const parsed = createTweetSchema.validate(request.body);
    if(parsed.error){
        logger.error('Validation error while creating tweet', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl,
                 error: parsed.error
                }
        }   ); 
        const erros = parsed.error.details.map((detail) => detail.message)
        return response.status(400).json({
            success : false, 
            message: 'Tweet validation error',
            error : {erros}
        })
    }
    const userId = request.user?._id;
    if(!userId){
        logger.error('User id not found while creating tweet', {
            meta: {
                route: request.originalUrl
            }
        })  
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
    if(!tweet){
        logger.error('Error creating tweet in database', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })  
        return response.status(400).json({
            success : false, 
            message : 'Error creating tweet'
        })
    }   
    return response.status(200).json({
        success: true, 
        message: 'Tweet created successfully', 
        tweet
    })
   } catch (error:any) {
    logger.error('Server error while creating tweet', {
        meta: {
            user: request.user?._id,
             route: request.originalUrl,
             error: error.message
            }
    }  )
    return response.status(400).json({
        success: false,
        message: 'Server error'
    })
   }
}

const editTweet = async(request : express.Request, response: express.Response) => {
    logger.info('Editing tweet', {
        meta: {
            user: request.user?._id,
             route: request.originalUrl
            }
    })      
    const parsed = editTweetSchema.validate(request.body);
    const {tweetId} = request.params; 

    if(parsed.error){
        const errors = parsed.error.details.map((detail) => detail.message)
        logger.error('Validation error while editing tweet',{
            meta: {
                user: request.user?._id,
                route: request.originalUrl,
                error : parsed.error.message
            }
        })
        return response.status(401).json({
            success: false,
            message : 'Error editing tweet', 
            error : {errors}
        })
    }
    if(!tweetId){
        logger.error('Tweet id not found while editing tweet', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })  
        return response.status(401).json({
            success: false, 
            message : 'Error finding tweetId'
        })
    }
    const content  = DOMPurify.sanitize(parsed.value.content)
    const userId = request.user?._id
    if(!userId){
        logger.error('User id not found while editing tweet', {
            meta: {
                route: request.originalUrl
                }
        })      
        return response.status(401).json({
            success :false, 
            message: 'User id not found'
        })
    }
    const tweet = await Tweet.findById(tweetId);

    if(tweet?.author.toString() !== userId.toString()){
        logger.error('User is not the owner of the tweet while editing tweet', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })  
        return response.status(401).json({
            success: false, 
            message: 'You are not owner of this tweet'
        })
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId , {
        content : content
    },{new : true})
    if(!updatedTweet){
        logger.error('Error updating tweet in database', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })  
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
    logger.info('Deleting tweet', {
        meta: {
            user: request.user?._id,
             route: request.originalUrl
            }
    })  
    const {tweetId} = request.params; 
    if(!tweetId){
        logger.error('Tweet id not found while deleting tweet', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })      
        return response.status(400).json({
            success :false, 
            message : 'Error deleting tweet'
        })
    }
    const tweet = await Tweet.findById(tweetId);
    const userId = request.user?._id
    if(!userId){
        logger.error('User id not found while deleting tweet', {        
            meta: {
                route: request.originalUrl
                }
        })  
        return response.status(401).json({
            success: false, 
            message: 'User id not found '
        })
    }

    if(tweet?.author.toString() !== userId.toString()){
        logger.error('User is not the owner of the tweet while deleting tweet', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })  
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
    logger.info('Getting tweet by id', {        
        meta: {
            user: request.user?._id,
             route: request.originalUrl
            }
    })
    const {tweetId} = request.params
    if(!tweetId){
        logger.error('Tweet id not found while getting tweet by id', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })
        return response.status(401).json({
            success: false, 
            message: 'Error getting tweetId'
        })
    }
    const tweetInformation = await Tweet.findById(tweetId);
    if(!tweetInformation){
        logger.error('Error fetching tweet information from database', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })
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
    logger.info('Liking tweet', {        
        meta: {
            user: request.user?._id,
             route: request.originalUrl
            }
    })
    const {tweetId} = request.params; 
    if(!tweetId){
        logger.error('Tweet id not found while liking tweet', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })  
        return response.status(401).json({
            success :false , 
            message : 'Error getting tweetId' 
        })
    }
    const userId = request.user?._id
    if(!userId){
        logger.error('User id not found while liking tweet', {
            meta: {
                route: request.originalUrl
                }
        })  
        return response.status(400).json({
            success: false, 
            message : 'User id not found'
        })
    }
    const alredyLiked = await LikeModel.findOne({userId, tweetId})

    if(alredyLiked){
        logger.error('Tweet already liked by user', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })
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
        logger.error('Error updating like count in database', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })  
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
    logger.info('Unliking tweet', {       
        meta: {
            user: request.user?._id,            
                route: request.originalUrl  
            }
    })
    const {tweetId} = request.params; 
    if(!tweetId){
        logger.error('Tweet id not found while unliking tweet', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })
        return response.status(401).json({
            success :false , 
            message : 'Error getting tweetId' 
        })
    }

    const userId = request.user?._id
    if(!userId){
        logger.error('User id not found while unliking tweet', {
            meta: {
                route: request.originalUrl
                }
        })
        return response.status(401).json({
            success: false, 
            message: 'User id not found'
        })
    }
    const likedRecord = await LikeModel.findOne({userId, tweetId})

    if(!likedRecord){
        logger.error('Like record not found while unliking tweet', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })
        return response.status(401).json({
            success: false, 
            message: 'Stop unlinking me I am not your ex'
        })
    }

    const updatedLikeCount = await Tweet.findByIdAndUpdate(tweetId, {
        $inc: {likeCount: -1}
    }, {new : true})

    if(!updatedLikeCount){
        logger.error('Error updating like count in database while unliking tweet', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })  
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
    logger.info('Retweeting tweet', {       
        meta: {
            user: request.user?._id,
             route: request.originalUrl
            }
    })
    const {tweetId} = request.params;
    if(!tweetId){
            logger.error('Tweet id not found while retweeting tweet', { 
            meta: { 
                user: request.user?._id,
                    route: request.originalUrl
                    }
            })
        return response.status(401).json({
            success : false, 
            message : 'Error getting tweetId'
        })
    }
    const tweetToRetweet = await Tweet.findById(tweetId);
    if(!tweetToRetweet){
        logger.error('Tweet to retweet not found in database', { 
            meta: { 
                user: request.user?._id,
                    route: request.originalUrl
                    }
            })
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
        logger.error('Error creating retweet in database', {
            meta: {     
                user: request.user?._id,
                    route: request.originalUrl
                    }
            })
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
    logger.info('Undoing retweet', {
        meta: {
            user: request.user?._id,
             route: request.originalUrl
            }
    })
    const {tweetId} = request.params;
    if(!tweetId){
        logger.error('Tweet id not found while undoing retweet', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })
        return response.status(401).json({
            success : false, 
            message : 'Error getting tweetId'
        })
    }
    const userId = request.user?._id;  
    const updateReTweetCount = await Tweet.findByIdAndUpdate(tweetId, {
        $inc: {retweetCount : -1}
    }) 
    if(!updateReTweetCount){
        logger.error('Error updating retweet count in database while undoing retweet', {
            meta: {     
                user: request.user?._id,
                    route: request.originalUrl
                    }
            })
        return response.status(401).json({
            success : false, 
            message : 'Error updating retweet count'
        })
    }   
    const deletedRetweet = await Tweet.findOneAndDelete({
        author : userId, 
        retweetOf: tweetId
    })
    if(!deletedRetweet){
        logger.error('Error deleting retweet from database while undoing retweet', {
            meta: {     
                user: request.user?._id,
                    route: request.originalUrl
                    }
            })  
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
    logger.info('Replying to tweet', {
        meta: {                     
            user: request.user?._id,
            route: request.originalUrl
            }
    })
    const {tweetId} = request.params;
    const parsed  = editTweetSchema.validate(request.body)
    if(parsed.error){
        logger.error('Validation error while replying to tweet', { 
            meta: { 
                user: request.user?._id,
                    route: request.originalUrl,
                    error: parsed.error
                    }
            })      
        const errors = parsed.error.details.map((detail) => detail.message)
        return response.status(401).json({
            success: false,
            message: 'Validation error',
            error: {errors}
        })
    }
    if(!tweetId){
        logger.error('Tweet id not found while replying to tweet', { 
            meta: { 
                user: request.user?._id,
                    route: request.originalUrl
                    }
            })
        return response.status(401).json({
            success : false, 
            message : 'Error getting tweetId'
        })
    }


    const userId = request.user?._id
    if(!userId){
        logger.error('User id not found while replying to tweet', { 
            meta: { 
                route: request.originalUrl
                }
            })  
        return response.status(401).json({
            success:false, 
            message: 'Error finding author'
        })
    }

    const originalTweet = await Tweet.findById(tweetId)
    if(!originalTweet){
        logger.error('Original tweet not found in database while replying to tweet', { 
            meta: { 
                user: request.user?._id,
                    route: request.originalUrl
                    }
            })  
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

    if(!replyToTweet){
        logger.error('Error creating reply tweet in database', { 
            meta: {  
                user: request.user?._id,
                route: request.originalUrl  , 
               }                
        })  
        return response.status(401).json({
            success: false, 
            message: 'Error replying to tweet'
        })
    }
    await Tweet.findByIdAndUpdate(tweetId, {
        $inc: {replyCount: 1}
    })
    if(!replyToTweet){
        logger.error('Error updating reply count in database while replying to tweet', {
            meta: {
                user: request.user?._id,    
                route: request.originalUrl
                }
        })
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
    logger.info('Getting replies for tweet', {
        meta: { 
            user: request.user?._id,
            route: request.originalUrl
            }
    })
    const {tweetId} = request.params;
    if(!tweetId){
        logger.error('Tweet id not found while getting replies for tweet', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })
        return response.status(401).json({
            success : false, 
            message : 'Error getting tweetId'
        })
    }

    const replies = await Tweet.find({
        isReply : true, 
        replyTo : tweetId
    })

    if(!replies){
        logger.error('Error fetching replies from database', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })  
        return response.status(400).json({
            success: false, 
            message: 'Error fetching replies'
        })
    }

    return response.status(201).json({
        success : true, 
        message : 'Replies fetched successfully', 
        replies
    })  
}

const getUserTweet = async(request:express.Request, response:express.Response ) => {
    logger.info('Getting user tweets', {
        meta: {
            user: request.user?._id,
             route: request.originalUrl
            }
    })
    const segment = AWSXRay.getSegment()

    const userId = request.user?._id;
    if(!userId){
        logger.error('User id not found while getting user tweets', {
            meta: {
                route: request.originalUrl
                }
        })
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
        logger.error('Error fetching user tweets from database', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl
                }
        })
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
    logger.info('Getting three random tweets', {    
        meta: {
            user: request.user?._id,
             route: request.originalUrl
            }
    })
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
    logger.error('Error fetching random tweets from database', {
        meta: {
            user: request.user?._id,
                route: request.originalUrl
                }
        })  
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