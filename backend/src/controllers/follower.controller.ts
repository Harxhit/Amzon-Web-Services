import logger from "../utils/logger.util";
import express , {Request ,Response} from 'express'; 
import Follower from "../models/follower.model";
import User from "../models/user.model";
import Notification from "../models/notificaiton.model";
import {io} from '../app'
import AWSXRay from 'aws-xray-sdk'



const followUser = async (request: Request, response: Response) => {
  logger.info("Follow user controller called", {
    meta: {
      route: request.originalUrl,
      user: request.user?._id
    }
  });
  try {
    const userId = request.user?._id;
    if (!userId) {
      logger.warn("User not found in follow user controller", {
        meta: {
          route: request.originalUrl
        }
      });
      return response.status(401).json({ success: false, message: "User not found" });
    }

    const followingId = request.params.id;
    if (!followingId) {
      logger.warn("Following id not found in follow user controller", {
        meta: {
          route: request.originalUrl,
          user: userId
        }
      });
      return response.status(400).json({ success: false, message: "Following id not found" });
    }

    const segment = AWSXRay.getSegment();
    const subsegment1 = segment?.addNewSubsegment('CheckAlreadyFollowed');

    const alreadyFollowed = await Follower.findOne({
      userWhoIsGettingFollowed: followingId,
      userWhoIsFollowingId: userId
    });

    if (alreadyFollowed) {
      subsegment1?.addError('Already following this user');
      logger.error("Attempt to follow an already followed user", {
        meta: {
          route: request.originalUrl,
          user: userId,
          followingId: followingId
        }
      }); 
      return response.status(400).json({
        success: false,
        message: "Already following this user"
      });
    }
    subsegment1?.close();

    const subsegment2 = segment?.addNewSubsegment('CreateFollowerRecord');
    await Follower.create({
      userWhoIsGettingFollowed: followingId,
      userWhoIsFollowingId: userId,
      isFollowed: true
    });
    subsegment2?.close();


    const subsegment3 = segment?.addNewSubsegment('FetchSenderDetails');

    const sender = await User.findById(userId).select('username firstName lastName')

    io.to(followingId.toString()).emit('notification:new',{
        type: 'follow',
        senderId: {
          firstName:sender?.firstName,
          lastName: sender?.lastName,
          username: sender?.username

        },
        message: `You have a new follower`,
        timeStamp: Date.now()
    })

    await User.bulkWrite([
      {
        updateOne: {
          filter: { _id: followingId },
          update: { $inc: { followersCount: 1 } }
        }
      },
      {
        updateOne: {
          filter: { _id: userId },
          update: { $inc: { followingCount: 1 } }
        }
      }
    ]);

    await Notification.create({
        receiverId: followingId, 
        senderId: userId, 
        type : 'follow'
    })

    subsegment3?.close();

    return response.status(200).json({
      success: true,
      message: "Followed user successfully", 
    });

  } catch (error:any) {
    logger.error('Error in follow user controller', {
      meta: {
        route: request.originalUrl,
        user: request.user?._id,
        error: error.message
      }
    });
    return response.status(500).json({ success: false, message: error });
  }
};


const unFollowUser = async(request: express.Request , response:express.Response) => {
  logger.info("Unfollow user controller called", {
    meta: {
      route: request.originalUrl,
      user: request.user?._id
    }
  });
  try {
        const userId = request.user?._id;
        if(!userId){
          logger.warn("User not found in unfollow user controller", {
            meta: {
              route: request.originalUrl
            }
          });
            return response.status(401).json({success : false , message : "User not found"})
        }
        
        const followingId = request.params.id;  
        if(!followingId){
          logger.warn("Following id not found in unfollow user controller", {
            meta: {
              route: request.originalUrl,
              user: userId
            }
          });
            return response.status(400).json({success : false , message : "Following id not found"})
        }

        const segment = AWSXRay.getSegment();

        const subsegment1 = segment?.addNewSubsegment('CheckAlreadyFollowed');
        
        const alreadyFollowed = await Follower.findOne({
            userWhoIsGettingFollowed : followingId , 
            userWhoIsFollowingId : userId
        })
        if(!alreadyFollowed){
            subsegment1?.addError('Not following this user');
            logger.error("Attempt to unfollow a user who is not followed", {
              meta: {
                route: request.originalUrl,
                user: userId,
                followingId: followingId
              }
            });
            return response.status(400).json({
                success : false , 
                message : "You are not following this user"
            })
        }
        subsegment1?.close();
        
        const subsegment2 = segment?.addNewSubsegment('DeleteFollowerRecord');
        await Follower.deleteOne({
            userWhoIsGettingFollowed : followingId , 
            userWhoIsFollowingId : userId
        })

        await User.bulkWrite([
            {
                updateOne : {
                    filter : {_id : followingId}, 
                    update : {$inc : {followersCount : -1}}
                }
            }, 
            {
                updateOne : {
                    filter : {_id : userId}, 
                    update : {$inc : {followingCount : -1}}
                }
            }
        ])
        subsegment2?.close();
        return response.status(200).json({
            success : true , 
            message : "Unfollowed user successfully"
        })  
    } catch (error:any) {
        logger.error('Server error', {
          meta: {
            route: request.originalUrl,
            user: request.user?._id,
            error: error.message
          }
        });
        return response.status(400).json({
            success : false ,
            message: error
        })
    }
}

const getFollower = async (request: express.Request, response: express.Response) => {
  logger.info("Get follower controller called", {
    meta: {
      route: request.originalUrl,
      user: request.user?._id
    }
  });
  try {
    const userId = request.user?._id;

    if (!userId) {
      logger.warn("User not found in get follower controller", {
        meta: {
          route: request.originalUrl
        }
      });
      return response.status(401).json({
        success: false,
        message: "Unable to find user"
      });
    }

    const segment = AWSXRay.getSegment();
    const subsegment = segment?.addNewSubsegment('FetchFollowingList');

    const followDocs = await Follower.find({
      userWhoIsFollowingId: userId,
      isFollowed: true
    }).select("userWhoIsGettingFollowed");
    if (!followDocs) {
      subsegment?.addError('No following found for this user');
      logger.error("No following found for user", {
        meta: {
          route: request.originalUrl,
          user: userId
        }
      });
      return response.status(404).json({
        success: false,
        message: "No following found for this user"
      });
    }
    const followingIds = followDocs.map(doc => doc.userWhoIsGettingFollowed.toString());

    subsegment?.close();

    return response.status(200).json({
      success: true,
      following: followingIds
    });

  } catch (error:any) {
    logger.error('Server error in get follower controller', {
      meta: {
        route: request.originalUrl,
        user: request.user?._id,
        error: error.message
      }
    });
    return response.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



export {followUser , unFollowUser , getFollower}