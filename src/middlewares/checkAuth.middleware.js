import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import {Hospital} from "../models/hospital.model.js";

const userAuth = async (req, res, next)=>{

    try{
        const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "");

        if (!token || token === '') {
            return res.status(401).json({success: false, message: "Unauthorized"})
        }


        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);


        const user = await User.findById(decodeToken?._id).select("-profileUrl -refreshToken");

        if (!user){
            return res.status(401).json({success:false, message:"Unauthorized user id"})
        }

        req.user = user


        next();
    }

    catch(error){
        res.status(401).json({success:false, message: "Unauthorized request"})
    }


}

const hospitalAuth = async (req, res, next)=>{

    try{
        const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "");

        if (!token || token === '') {
            return res.status(401).json({success: false, message: "Unauthorized"})
        }


        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);


        const hospital = await Hospital.findById(decodeToken?._id).select("-password -refreshToken ");

        if (!hospital){
            return res.status(401).json({success:false, message:"Unauthorized hospital id"})
        }

        req.hospital = hospital


        next();
    }

    catch(error){
        console.log(error)
        res.status(401).json({success:false, message: "Unauthorized request"})
    }
}

const accountantAuth = (req, res, next)=>{

    try{

        const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "");

        if (!token || token === '') {
            return res.status(401).json({success: false, message: "Unauthorized"});
        }

        const decodeToken = jwt.verify(token, process.env.HOSPITAL_TOKEN_SECRET);

        req.body.hospitalID = decodeToken.hospitalID;

        next();
    }
    catch(err){
        console.log(err);
        return res.status(401).json({success:false, message: "Unauthorized request"});
    }

}


export {userAuth, hospitalAuth, accountantAuth};