import express from 'express'
const Router = express.Router()

import {login, bookAppointment} from "../controllers/accountant.controller.js";
import {accountantAuth} from "../middlewares/checkAuth.middleware.js";

Router.route('/login')
    .post(login)

Router.route('/bookAppointment')
    .post(accountantAuth, bookAppointment)


export default Router;