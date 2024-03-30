import express from 'express'
const Router = express.Router()

// Controllers
import {register, sendOTP, login, hireDoctor, refreshAccessToken, addAccountant, removeDoctor, addScheme} from "../controllers/hospital.controller.js";

// Middlewares
import {hospitalAuth} from "../middlewares/checkAuth.middleware.js";

import upload from "../middlewares/multer.middleware.js";

Router.route('/register')
    .post(register)

Router.route('/sendOTP')
    .post(sendOTP)

Router.route('/login')
    .post(login)

Router.route('/refreshToken')
    .get(refreshAccessToken)

Router.route('/hireDoctor')
    .post(hospitalAuth, upload.single('profile'), hireDoctor)

Router.route('/removeDoctor')
    .delete(hospitalAuth, removeDoctor)

Router.route('/addAccountant')
    .post(hospitalAuth, addAccountant)

Router.route('/addSchema')
    .post(hospitalAuth, addScheme)

export default Router