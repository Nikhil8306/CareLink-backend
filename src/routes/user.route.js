import express from 'express'
const Router = express.Router()

//Controllers
import { register, refreshAccessToken } from "../controllers/user.controller.js";

Router.route('/register')
    .post(register)

Router.route('/refreshToken')
    .post(refreshAccessToken)

export default Router