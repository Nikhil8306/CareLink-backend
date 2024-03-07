import express from 'express'
const app = express()

import cors from 'cors'
import cookieParser from 'cookie-parser'


app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))


// Routes
import userRoute from './routes/user.route.js'

app.use('/user', userRoute)


export default app