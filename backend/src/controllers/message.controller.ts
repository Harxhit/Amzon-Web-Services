import logger from "../utils/logger.util";
import Message from "../models/message.model";
import express, {Request , Response} from 'express'
import mongoose from "mongoose";

const getConversations = async(request: express.Request, response: express.Response) => {
    try {
        const chatId = request.params.id
        console.log('ChatId' , chatId)
        if(!chatId){
            return response.status(400).json({
                success : false, 
                message: 'Chat Id not found'
            })
        }

        const chats = await Message.find({chatId}).sort({createdAt:1})

        if(!chats){
            return response.status(400).json({
                success: false, 
                message: 'Chats not found'
            })
        }

        return response.status(201).json({
            success:true, 
            message: 'Chat history fetched successfully',
            chats
        })
        
    } catch (error:any) {
        logger.log(error)
        return response.status(400).json({
            success: false, 
            message :error
        })
    }
}

const getMessageByUser = async(request:express.Request, response:express.Response) => {}

const markMessageAsRead = async(request:express.Request, response:express.Response) => {}

const getAllConversations = async (request: express.Request, response: express.Response) => {
  try {
    const userId = request.user?._id 

    if (!userId) {
      return response.status(401).json({
        success: false,
        message: "Unauthorized: userId missing",
      });
    }

    const myId = new mongoose.Types.ObjectId(userId);

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

    return response.status(200).json({
      success: true,
      conversations,
    });
  } catch (error: any) {
    console.error("Conversation Error:", error);
    return response.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


export {getConversations , getMessageByUser ,markMessageAsRead , getAllConversations}