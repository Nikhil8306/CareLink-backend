import express from 'express'
const Router = express.Router()

import {addScheme} from "../controllers/government.controller.js";

Router.route('/addScheme')
    .post(addScheme)



export default Router;
