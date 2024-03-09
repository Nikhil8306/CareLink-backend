import express from 'express'
const Router = express.Router()



//Controllers
import { register, refreshAccessToken } from "../controllers/user.controller.js";
import { sendOTP, verifyOTP } from "../controllers/otp.controller.js";

Router.route('/sendOTP')
    .get(sendOTP)

Router.route('/register')
    .post(verifyOTP, register)

Router.route('/refreshToken')
    .post(refreshAccessToken)




export default Router