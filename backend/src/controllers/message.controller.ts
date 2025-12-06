import logger from "../utils/logger.util";
import Message from "../models/message.model";
import express, {Request , Response} from 'express'
import mongoose from "mongoose";
import AWSXRay from 'aws-xray-sdk'


const getConversations = async(request: express.Request, response: express.Response) => {
  logger.log('Get old messages called', {
    meta: {
      user: request.user?._id,
      route: request.originalUrl,
    }
  }) 

    try {
        const chatId = request.params.id
        // console.log('ChatId' , chatId)
        if(!chatId){
            logger.error('Chat Id not found',{
              meta: {
                user: request.user?._id,
                route: request.originalUrl
              }
            })
            return response.status(400).json({
                success : false, 
                message: 'Chat Id not found'
            })
        }

        const segement = AWSXRay.getSegment()

        const subSegment = segement?.addNewSubsegment('db-old-message')

        const chats = await Message.find({chatId}).sort({createdAt:1})

        if(!chats){
          subSegment?.addError('Old message error')
          logger.error('Chats not found', {
            meta: {
              user: request.user?._id,
              route: request.originalUrl
            }
          })
            return response.status(400).json({
                success: false, 
                message: 'Chats not found'
            })
        }

        subSegment?.close()

        return response.status(201).json({
            success:true, 
            message: 'Chat history fetched successfully',
            chats
        })
        
    } catch (error:any) {
        logger.log('Error fetching old messages', {
          meta: {
            user: request.user?._id,
            route: request.originalUrl,
            error: error.message
          }
        })
        return response.status(400).json({
            success: false, 
            message :error
        })
    }
}

const getMessageByUser = async(request:express.Request, response:express.Response) => {}

const markMessageAsRead = async(request:express.Request, response:express.Response) => {}

const getAllConversations = async (request: express.Request, response: express.Response) => {
  logger.info('Get all conversations called', {
    meta: {
      user: request.user?._id,
      route: request.originalUrl,
    }
  })
  try {
    const userId = request.user?._id 

    if (!userId) {
      logger.error('Unauthorized: userId missing', {
        meta: {
          route: request.originalUrl,
        }
      })
      return response.status(401).json({
        success: false,
        message: "Unauthorized: userId missing",
      });
    }

    const myId = new mongoose.Types.ObjectId(userId);

    const segment = AWSXRay.getSegment()

    const subSegment = segment?.addNewSubsegment('db-all-conversations')

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: myId },
            { receiverId: myId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: "$chatId",
          lastMessage: { $first: "$content" },
          lastMessageTime: { $first: "$createdAt" },
          sender: { $first: "$senderId" },
          receiver: { $first: "$receiverId" }
        }
      },
      {
        $addFields: {
          otherUserId: {
            $cond: [{ $eq: ["$sender", myId] }, "$receiver", "$sender"]
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "otherUserId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      }
    ]);

    if(!conversations){
      subSegment?.addError('Error finding conversations')
      logger.error('Either user dont have conversation or server erorr', {
        meta: {
          user: request.user?._id,
          route: request.originalUrl
        }
      })
      return response.status(400).json({
        success: false, 
        message: 'Either user dont have conversation or server erorr'
      })
    }

    subSegment?.close()

    return response.status(200).json({
      success: true,
      conversations,
    });
  } catch (error: any) {
    logger.error('Server error while fetching conversations', {
      meta: {
        user: request.user?._id,
        route: request.originalUrl,
        error: error.message
      }
    })
    return response.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


export {getConversations , getMessageByUser ,markMessageAsRead , getAllConversations}