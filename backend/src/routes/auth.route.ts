import {Router} from 'express'
import authMe from '../controllers/auth.controllers'
import verifyJwt from '../middlewares/authentication.middleware'

const authRouter =  Router()

authRouter.get('/me', verifyJwt , authMe)


export default authRouter