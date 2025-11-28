import logger from "../utils/logger.util";
import express , {Request ,Response} from 'express'; 
import Follower from "../models/follower.model";
import User from "../models/user.model";
import Notification from "../models/notificaiton.model";
import {io} from '../app'

const followUser = async (request: Request, response: Response) => {
  try {
    const userId = request.user?._id;
    if (!userId) {
      return response.status(401).json({ success: false, message: "User not found" });
    }

    const followingId = request.params.id;
    if (!followingId) {
      return response.status(400).json({ success: false, message: "Following id not found" });
    }

    const alreadyFollowed = await Follower.findOne({
      userWhoIsGettingFollowed: followingId,
      userWhoIsFollowingId: userId
    });

    if (alreadyFollowed) {
      return response.status(400).json({
        success: false,
        message: "Already following this user"
      });
    }

    await Follower.create({
      userWhoIsGettingFollowed: followingId,
      userWhoIsFollowingId: userId,
      isFollowed: true
    });

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

    return response.status(200).json({
      success: true,
      message: "Followed user successfully", 
    });

  } catch (error) {
    logger.error(error);
    return response.status(500).json({ success: false, message: error });
  }
};


const unFollowUser = async(request: express.Request , response:express.Response) => {
    try {
        
        const userId = request.user?._id;
        if(!userId){
            return response.status(401).json({success : false , message : "User not found"})
        }
        
        const followingId = request.params.id;  
        if(!followingId){
            return response.status(400).json({success : false , message : "Following id not found"})
        }
        
        const alreadyFollowed = await Follower.findOne({
            userWhoIsGettingFollowed : followingId , 
            userWhoIsFollowingId : userId
        })
        if(!alreadyFollowed){
            return response.status(400).json({
                success : false , 
                message : "You are not following this user"
            })
        }
        
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
        
        return response.status(200).json({
            success : true , 
            message : "Unfollowed user successfully"
        })  
    } catch (error) {
        logger.error(error)
        return response.status(400).json({
            success : false ,
            message: error
        })
    }
}

const getFollower = async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unable to find user"
      });
    }

    const followDocs = await Follower.find({
      userWhoIsFollowingId: userId,
      isFollowed: true
    }).select("userWhoIsGettingFollowed");

    const followingIds = followDocs.map(doc => doc.userWhoIsGettingFollowed.toString());

    return res.status(200).json({
      success: true,
      following: followingIds
    });

  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



export {followUser , unFollowUser , getFollower}