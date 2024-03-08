import express from 'express'
const Router = express.Router()

// middlewares
import checkAuth from '../middlewares/checkAuth.middleware.js'

// controllers

Router.route('/')
    .get(checkAuth, function(req, res){
        console.log("Someone got access");
        res.send("Hello User");
    })

export default Router