import express from 'express'
const app = express()

import cors from 'cors'
import cookieParser from 'cookie-parser'

app.use(cors({
    origin:'*'
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static('../public'))


// Routes
import userRoute from './routes/user.route.js'
import hospitalRoute from './routes/hospital.route.js'


app.use('/user', userRoute)
app.use('/hospital', hospitalRoute)


export default app