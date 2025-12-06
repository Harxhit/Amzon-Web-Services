import express , {Request , Response} from "express"; 
import logger from "../utils/logger.util";
import Notification from "../models/notificaiton.model";
import AWSXRay from 'aws-xray-sdk'

const getNotifications = async(request:express.Request, response:express.Response) => {
    logger.info('Getting notifications for user', {
        meta: { 
            user: request.user?._id,
            route: request.originalUrl
            }
    })
    try {
        const userId = request.user?._id
        if(!userId){
            logger.error('User id not found while getting notifications', {
                meta: {
                    route: request.originalUrl
                    }
            })
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
            logger.error('Error fetching notifications from database', {
                meta: {
                    user: request.user?._id,
                     route: request.originalUrl
                    }
            })
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
        logger.error('Server error while getting notifications', {
            meta: {
                user: request.user?._id,
                 route: request.originalUrl,
                 error: error.message
                }
        })
        return response.status(401).json({
            success : false, 
            message: error
        })
    }
}



export {getNotifications}