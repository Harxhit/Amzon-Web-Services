import express from 'express'
import cookie from 'cookie-parser'
import userRouter from './routes/user.route'
import cors from 'cors'
import authRouter from './routes/auth.route'
import { Request , Response , NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import tweetRouter from './routes/tweet.route'
import followerRouter from './routes/follower.route'
import notificationRouter  from './routes/notification.route'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import Message from './models/message.model'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import logger from './utils/logger.util'
import messageRouter from './routes/message.route'



dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.json({ limit: "10kb" }));
app.use(cookie())
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}))


const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 200,                 
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Try again later."
    }
});

app.use(globalLimiter);


app.use((request:Request,response:Response, next:NextFunction) => {
  response.setHeader("Access-Control-Allow-Credentials", "true")
  next()
})

app.use('/api/auth' , authRouter )
app.use('/api/users', userRouter)
app.use('/api/tweet',tweetRouter)
app.use('/api/follower',followerRouter)
app.use('/api/notification',notificationRouter)
app.use('/api/message', messageRouter)

export const server = createServer(app)
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",    
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("User connected successfully");

  const request = socket.request as any
  const token = request.cookies?.token

  let userId : string | null = null
  if(token){
    try {
      const payLoad = jwt.verify(token , process.env.JWT_SECRET!) as any
      userId = payLoad._id
      socket.on('joinRoom' , (userId:string) => {
        socket.join(userId)
        console.log(`User with ${userId} has joined the room`)
      })
    } catch (error:any) {
      logger.error(error)
    }
  }

  socket.on('joinChatRoom' , (chatId) => {
    console.log('User joined chat room successfully',chatId)
    socket.join(chatId)
  })
  socket.on("message", async (data) => {
  const { chatId, senderId, receiverId, content } = data;
  console.log(data)
  const newMessage = {
    chatId, 
    senderId,
    receiverId,
    content,
    deliveredAt: Date.now(),
  };
  await Message.create(newMessage)
  io.to(chatId).emit("message:received", newMessage);
  });
});


app.use((request, response, next) => {
  console.log(
    `Incoming request: ${request.method} \n Endpoint: ${request.originalUrl}`,
  );
  next();
});
export default app