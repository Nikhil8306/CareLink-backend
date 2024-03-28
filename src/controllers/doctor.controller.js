import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

import {Doctor} from "../models/doctor.model.js";

const register = async (req, res)=>{
    try{
        const {EID, password} = req.body;

        if (!EID || !password) return res.status(400).json({success:false, message:"Insufficient credentials"});

        const doctor = await Doctor.findOne({EID});

        if (!doctor) return res.status(401).json({success:false, message:"No such doctor found"});
        if (doctor.password) return res.status(409).json({success:false, message:"Doctor is already registered"});

        doctor.password = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND));

        await doctor.save({validateBeforeSave:false});

        return res.status(200).json({success:true, message:"Successfully registered"});
    }

    catch(err){
        console.log(err);
        return res.status(500).json({success:false, message:"Error in registration"})
    }

}

const login = async (req, res)=>{

    try{

        const {EID, password} = req.body;
        if (!EID || !password) return res.status(400).json({success:false, message:"Insufficient credentials"});

        const doctor = await Doctor.findOne({EID});
        if (!doctor) return res.status(401).json({success:false, message:"Invalid EID"});
        if (!doctor.password) return res.status(409).json({success:false, message:"Please register first"});

        const passCheck = await bcrypt.compare(password, doctor.password);
        if (!passCheck) return res.status(401).json({success:false, message:"Invalid Password"});

        const token = await jwt.sign({
            _id:doctor._id,
        }, process.env.DOCTOR_TOKEN_SECRET);

        const options ={
            httpOnly:true,
            secure:true,
        }

        return res.status(200)
            .cookie("accessToken", token, options)
            .json({success:true, message:"Successfully logged in"});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({success:false, message:"Error in logging in"});
    }
}

export {register, login }