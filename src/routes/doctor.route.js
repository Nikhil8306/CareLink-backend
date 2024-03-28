import express from 'express'
const Router = express.Router()

import {register, login} from "../controllers/doctor.controller.js";
import {sendDoctorOTP, verifyDoctorOTP} from "../controllers/otp.controller.js";
import {doctorAuth} from "../middlewares/checkAuth.middleware.js";


Router.route('/sendOTP')
    .get(sendDoctorOTP)

Router.route('/register')
    .post(verifyDoctorOTP, register)

Router.route('/login')
    .post(login)


export default Router;