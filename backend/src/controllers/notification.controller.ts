import express , {Request , Response} from "express"; 
import logger from "../utils/logger.util";
import Notification from "../models/notificaiton.model";
import AWSXRay from 'aws-xray-sdk'

const getNotifications = async(request:express.Request, response:express.Response) => {
    try {
        const userId = request.user?._id
        if(!userId){
            return response.status(401).json({
                success:false, 
                message : 'User not found'
            })
        }
        const segment = AWSXRay.getSegment()

        const subSegment1 = segment?.addNewSubsegment('db-old-notifications')

        const notificaitons = await Notification.find({receiverId: userId}).populate('senderId','firstName lastName username').sort({createdAt: -1})
        if(!notificaitons){
            subSegment1?.addError('Notification fetching error')
            return response.status(401).json({
                success: false, 
                message: 'Server error'
            })
        }
        subSegment1?.close()
        
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