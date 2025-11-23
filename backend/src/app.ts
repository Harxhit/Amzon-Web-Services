import express from 'express'
import cookie from 'cookie-parser'


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookie())

app.use((request, response, next) => {
  console.log(
    `Incoming request: ${request.method} \n Endpoint: ${request.originalUrl}`,
  );
  next();
});
export default app