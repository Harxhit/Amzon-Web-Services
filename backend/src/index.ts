import app from "./app";
import connectToDataBase from "./database";
import dotenv from 'dotenv'

dotenv.config() 
 
const port = process.env.PORT

connectToDataBase()
.then(() => {
    app.listen(port,() => 
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