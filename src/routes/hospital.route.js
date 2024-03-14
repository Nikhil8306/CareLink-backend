import express from 'express'
const Router = express.Router()

// Controllers
import {register, sendOTP, login} from "../controllers/hospital.controller.js";

// Middlewares
import {hospitalAuth} from "../middlewares/checkAuth.middleware.js";


Router.route('/register')
    .post(register)

Router.route('/sendOTP')
    .get(sendOTP)

Router.route('/login')
    .post(login)

export default Router