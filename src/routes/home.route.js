import express from 'express'
const Router = express.Router()
//Middlewares
import checkAuth from '../middlewares/checkAuth.middleware.js'

Router.route('/')
    .get(checkAuth, function(req,res){
        res.send("HEllo There, This is home page")
    })

export default Router