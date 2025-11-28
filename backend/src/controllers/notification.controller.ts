import express , {Request , Response} from "express"; 
import logger from "../utils/logger.util";
import Notification from "../models/notificaiton.model";

const getNotifications = async(request:express.Request, response:express.Response) => {
    try {
        const userId = request.user?._id
        if(!userId){
            return response.status(401).json({
                success:false, 
                message : 'User not found'
            })
        }

        const notificaitons = await Notification.find({receiverId: userId}).populate('senderId','firstName lastName username').sort({createdAt: -1})
        if(!notificaitons){
            return response.status(401).json({
                success: false, 
                message: 'Server error'
            })
        }
        console.log(notificaitons)
        return response.status(201).json({
            success: true, 
            message : 'Notifications fetched successfully',
            notificaitons
        })
    } catch (error:any) {
        logger.error(error)
        return response.status(401).json({
            success : false, 
            message: error
        })
    }
}



export {getNotifications}