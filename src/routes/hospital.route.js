import express from 'express'
const Router = express.Router()

// Controllers
import {register, sendOTP, login, hireDoctor, refreshAccessToken} from "../controllers/hospital.controller.js";

// Middlewares
import {hospitalAuth} from "../middlewares/checkAuth.middleware.js";


Router.route('/register')
    .post(register)

Router.route('/sendOTP')
    .get(sendOTP)

Router.route('/login')
    .post(login)

Router.route('/hireDoctor')
    .post(hospitalAuth, hireDoctor)

Router.route('/refreshToken')
    .get(refreshAccessToken)

export default Router