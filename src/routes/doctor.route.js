import express from 'express'
const Router = express.Router()

import {register, login, markUnavailable, markAvailable} from "../controllers/doctor.controller.js";
import {sendDoctorOTP, verifyDoctorOTP} from "../controllers/otp.controller.js";
import {doctorAuth} from "../middlewares/checkAuth.middleware.js";


Router.route('/sendOTP')
    .post(sendDoctorOTP)

Router.route('/register')
    .post(verifyDoctorOTP, register)

Router.route('/login')
    .post(login)

Router.route('/markAvailable')
    .post(doctorAuth, markAvailable)

Router.route('/markUnavailable')
    .post(doctorAuth, markUnavailable)


export default Router;