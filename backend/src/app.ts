import express from 'express'
import cookie from 'cookie-parser'
import userRouter from './routes/user.route'
import cors from 'cors'
import authRouter from './routes/auth.route'
import { Request , Response , NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import tweetRouter from './routes/tweet.route'




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

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,  
    max: 10,                  
    message: "Too many login attempts"
});

app.use((request:Request , response  :Response  ,next:NextFunction) => {
  response.setHeader("Access-Control-Allow-Credentials", "true")
  next()
})

app.use('/api/auth' , authRouter )
app.use('/api/users', userRouter)
app.use('/api/tweet',tweetRouter)

app.use((request, response, next) => {
  console.log(
    `Incoming request: ${request.method} \n Endpoint: ${request.originalUrl}`,
  );
  next();
});
export default app