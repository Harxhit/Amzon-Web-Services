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


export const server = createServer(app)
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",    
    credentials: true
  }
});

io.on('connection',(socket) => {
  console.log('User connected successfully')

  socket.on('joinRoom',(userId:string)=> {
    socket.join(userId);
    console.log(`User ${userId} have joined the room`)
  })
})

app.use((request, response, next) => {
  console.log(
    `Incoming request: ${request.method} \n Endpoint: ${request.originalUrl}`,
  );
  next();
});
export default app