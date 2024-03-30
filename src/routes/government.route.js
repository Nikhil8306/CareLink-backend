import express from 'express'
const Router = express.Router()

import {addSchema} from "../controllers/government.controller.js";

Router.route('/addScheme')
    .post(addSchema)


export default Router;
