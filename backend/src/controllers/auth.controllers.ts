import {Request , Response} from 'express'
import { UserDocument } from '../models/user.model';
import logger from '../utils/logger.util';
interface RequestWithUser extends Request {
  user?: UserDocument;
}

const authMe = async(request: RequestWithUser , response: Response) => {
    logger.info(`Auth Me Route Accessed`, {
        user :request.user?._id,
        ip: request.ip,
    });  
    try {
        response.status(200).json({
            success: true, 
            user: request.user as any
        })
    } catch (error : any) {
        response.status(500).json({
            success : false, 
            message : error.message
        })
    }
}

export default authMe