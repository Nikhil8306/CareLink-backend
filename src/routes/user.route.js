import express from 'express'
const Router = express.Router()



//Controllers
import {verify, register, refreshAccessToken, logout , updateProfile, getAppointments, bookAppointment, getScheme, getSchemaHospital, getHospital, getDoctor} from "../controllers/user.controller.js";
import { sendOTP, verifyOTP } from "../controllers/otp.controller.js";

//Middlewares
import {userAuth} from '../middlewares/checkAuth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

Router.route('/verify')
    .get(verify)
Router.route('/sendOTP')
    .get(sendOTP)

Router.route('/register')
    .post(verifyOTP, register)

Router.route('/refreshToken')
    .get(refreshAccessToken)

Router.route('/logout')
    .post(userAuth, logout)

Router.route('/updateProfile')
    .post(userAuth, upload.single('profile'), updateProfile)

Router.route('/getAppointments')
    .get(userAuth, getAppointments)

Router.route('/bookAppointment')
    .post(userAuth, bookAppointment)

Router.route('/getScheme')
    .get(userAuth, getScheme)

Router.route('/getSchemeHospital')
    .get(userAuth, getSchemaHospital);

Router.route('/getDoctor')
    .get(userAuth, getDoctor)

Router.route('/getHospital')
    .get(userAuth, getDoctor)

export default Router