
import {config} from 'dotenv'
config()

import app from './src/app.js'
import connectDB from "./src/db/db.js";
import {configureCloudinary} from "./src/util/cloudinary.util.js";

connectDB()
    .then(()=>{
        app.listen(process.env.PORT || 9000, ()=>{
            console.log("Server listening at ", process.env.PORT || 9000)
        })
        configureCloudinary()
    })
    .catch((err)=>{
        console.log("Error in connecting to the database !!")
    })
