import express from 'express'
import cookie from 'cookie-parser'
import userRouter from './routes/user.route'
import cors from 'cors'
import authRouter from './routes/auth.route'
import { Request , Response , NextFunction } from 'express'
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookie())
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}))

app.use((request:Request , response  :Response  ,next:NextFunction) => {
  response.setHeader("Access-Control-Allow-Credentials", "true")
  next()
})
app.use('/api/auth' ,authRouter )
app.use('/api/users', userRouter)
app.use((request, response, next) => {
  console.log(
    `Incoming request: ${request.method} \n Endpoint: ${request.originalUrl}`,
  );
  next();
});
export default app