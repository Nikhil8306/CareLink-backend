import dotenv from 'dotenv'
dotenv.config()

import app from './app.js'
import connectDB from "./db/db.js";

connectDB()
    .then(()=>{
        app.listen(process.env.PORT || 9000, ()=>{
            console.log("Server listening at ", process.env.PORT || 9000)
        })
    })
    .catch((err)=>{
        console.log("Error in connecting to the database !!")
    })