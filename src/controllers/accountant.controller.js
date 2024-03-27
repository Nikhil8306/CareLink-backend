import {Accountant} from "../models/accountant.model.js";
import {Appointment} from "../models/appointment.model.js"
import {DoctorAvailability} from "../models/doctorAvailability.model.js";

import jwt from "jsonwebtoken";
import {Hospital} from "../models/hospital.model.js";

const login = async (req, res)=> {
    try{
        if (!req.body.UID) return res.status(400).json({success:false})
        const acc = await Accountant.findOne({UID:req.body.UID});
        if (!acc) return res.status(401).json({success:false, message:"No such id found"})

        if (acc.inUse) return res.status(401).json({success:false, message:"Account Id is already in use"});

        acc.inUse = true;
        await acc.save({validateBeforeSave:true});

        const token = await jwt.sign({
            hospitalID: acc.hospitalID,
            UID:req.body.UID,
        }, process.env.HOSPITAL_TOKEN_SECRET);

        const options = {
            httpOnly:true,
            secure:true,
        }
        return res.status(200)
            .cookie("accessToken", token, options)
            .json({success:true, message:"SuccessFully Logged In"});
    }

    catch(err){
        console.log(err);

        return res.status(500).json({success:false, message:"Unable to login"});
    }
}

const bookAppointment = async (req, res)=>{

    try {

        const {doctorID, hospitalID, userID, name, age, address, gender} = req.body;

        if (!doctorID || !hospitalID || (!userID && (!name || !age || !address || !gender)))
            return res.status(400).json({success:false, message:"Please send full details"})

        const doctor = await DoctorAvailability.findOne({doctorID});

        if (!doctor) return res.status(404).json({success:false, message:"No such doctor found"});

        const hospital = await Hospital.findById(hospitalID);
        if (hospital.doctors.indexOf(doctorID) === -1) return res.status(400).json({success:false, message:"No such doctor available"});

        if (!doctor.isAvailable) return res.status(400).json({success:false, message:"Doctor is currently not available"});

        doctor.token += 1;

        await doctor.save({validateBeforeSave:false});

        let details = {
            doctorID,
            hospitalID,
            name,
            age,
            address,
            gender,
            userID,
            token:doctor.token,
        }

        await Appointment.create(details);

        return res.status(200).json({success:true, message:"Successfully booked the appointment", token:details.token, roomNo:doctor.roomNo});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({success:false, message:"Something went wrong in booking the appointment"})
    }

}

export {login, bookAppointment};