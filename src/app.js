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
import homeRoute from './routes/home.route.js'

app.use('/user', userRoute)
app.use('/home', homeRoute)

export default app