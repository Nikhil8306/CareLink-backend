import express from 'express'
const Router = express.Router()

//Controllers
import {register} from "../controllers/user.controller.js";

Router.route('/register')
    .post(register)

export default Router