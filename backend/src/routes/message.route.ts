import {Router} from 'express'
import { getConversations , getAllConversations} from '../controllers/message.controller'
import asyncHandler from '../utils/asynHandler'
import verifyJwt from '../middlewares/authentication.middleware'

const messageRouter = Router()

messageRouter.route('/conversation/:id').get(verifyJwt , asyncHandler(getConversations))

messageRouter.route('/getAll').get(verifyJwt , asyncHandler(getAllConversations))

export default messageRouter

