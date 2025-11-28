import app from "./app";
import connectToDataBase from "./database";
import dotenv from 'dotenv'
import {server} from './app'
dotenv.config() 
 
const port = process.env.PORT

connectToDataBase()
.then(() => {
    server.listen(port,() => 
        {
            console.log(`Server is running at http://localhost:${port}`)
        }
    )
})
.catch(
    (error) => 
        {console.error(error)

        }
    )