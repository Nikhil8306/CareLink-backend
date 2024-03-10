import express from 'express'
const Router = express.Router()



//Controllers
import { register, refreshAccessToken, logout , updateProfile } from "../controllers/user.controller.js";
import { sendOTP, verifyOTP } from "../controllers/otp.controller.js";

//Middlewares
import checkAuth from '../middlewares/checkAuth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

Router.route('/sendOTP')
    .get(sendOTP)

Router.route('/register')
    .post(verifyOTP, register)

Router.route('/refreshToken')
    .get(refreshAccessToken)

Router.route('/logout')
    .post(checkAuth, logout)

Router.route('/updateProfile')
    .post(checkAuth, upload.single('profile'), updateProfile)




export default Router