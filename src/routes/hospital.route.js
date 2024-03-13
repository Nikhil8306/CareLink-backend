import express from 'express'
const Router = express.Router()

// Controllers
import {register, sendOTP} from "../controllers/hospital.controller.js";


Router.route('/register')
    .post(register)

Router.route('/sendOTP')
    .get(sendOTP)


export default Router