import express from 'express'
const Router = express.Router()



//Controllers
import { register, refreshAccessToken, logout , updateProfile } from "../controllers/user.controller.js";
import { sendOTP, verifyOTP } from "../controllers/otp.controller.js";

//Middlewares
import {userAuth} from '../middlewares/checkAuth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

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




export default Router