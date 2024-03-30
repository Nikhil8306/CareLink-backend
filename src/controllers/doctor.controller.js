import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

import {Doctor} from "../models/doctor.model.js";
import {DoctorAvailability} from "../models/doctorAvailability.model.js";
import {Appointment} from "../models/appointment.model.js";
import User from "../models/user.model.js";

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

const markAvailable = async (req, res)=>{

    try{

        const doctor = await DoctorAvailability.findOne({doctorID:req.body.doctorID});
        if (!doctor) return res.status(401).json({success:false, message:"Cannot get the doctor"});

        doctor.isAvailable = true;
        doctor.totalPatients = 0;
        doctor.token = 1;

        await doctor.save({validateBeforeSave:false});

        return res.status(200).json({success:true, message:"Successfully marked!!!"});

    }
    catch(err) {

        console.log(err);
        return res.status(500).json({success:false, message:"Error in marking"});

    }

}

const markUnavailable = async (req, res)=>{

    try{

        const doctor = await DoctorAvailability.findOne({doctorID:req.body.doctorID});
        if (!doctor) return res.status(401).json({success:false, message:"Cannot get the doctor"});

        doctor.isAvailable = false;
        await doctor.save({validateBeforeSave:false});

        return res.status(200).json({success:true, message:"Successfully marked!!!"});

    }
    catch(err) {

        console.log(err);
        return res.status(500).json({success:false, message:"Error in marking"});

    }

}

const seasonDetails = async (req, res)=>{

    try{

        const details ={}
        const doctor = DoctorAvailability.findOne({doctorID:req.body.doctorID});
        details.currToken = doctor.token;
        details.totalPatients = doctor.totalPatients;

        return res.status(200).json({data:details});
    }
    catch(err){

        console.log(err);
        return res.status(500).json({success:false, message:"Something went wrong"});

    }

}

const getUserDetails = async (req, res)=>{
    try{

        const {doctorID} = req.body;
        if (!doctorID) return res.status(400).json({success:false, message:"Error in fetching doctor details"});

        const currToken = (await DoctorAvailability.findOne({doctorID})).token;
        const appointment = await Appointment.findOne({doctorID, token:currToken});
        const user = await User.findOne({_id:appointment.userID});

        let details = {
            name:user.name,
            age:user.age,
            address:user.address,
            gender:user.gender
        }

        return res.status(200).json({success:true, data:details});

    }
    catch(err){

        console.log(err);
        return res.status(500).json({success:false, message:"Something went wrong"});

    }
}

export {register, login, markUnavailable, markAvailable, seasonDetails};