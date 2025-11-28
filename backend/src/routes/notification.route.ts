import {Router} from 'express'
import asyncHandler from '../utils/asynHandler'
import verifyJwt from '../middlewares/authentication.middleware'
import { getNotifications } from '../controllers/notification.controller'

const notificationRouter = Router()

notificationRouter.route('/all').get(verifyJwt, asyncHandler(getNotifications))


export default notificationRouter 