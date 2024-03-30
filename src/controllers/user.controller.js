import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import {Appointment} from "../models/appointment.model.js";
import {DoctorAvailability} from "../models/doctorAvailability.model.js";
import {Hospital} from "../models/hospital.model.js";
import GovernmentScheme from "../models/governmentScheme.model.js";
import {HospitalReport} from "../models/hospitalReport.model.js";
import {Doctor} from "../models/doctor.model.js";

import {uploadOnCloudinary} from "../util/cloudinary.util.js";
import fs from 'fs'

const generateRefreshAndAccessToken = async (_id) => {

    const refreshToken = await jwt.sign({

        _id:_id

    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXP
        })

    const accessToken = await jwt.sign({
            _id:_id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXP
        })


    const user = await User.findById(_id);
    user.refreshToken = refreshToken

    await user.save({validateBeforeSave:false})

    return { refreshToken , accessToken };
}


const register = async (req, res)=>{

    try{
        const mobile = req.body.mobile;
        if (!mobile || mobile === '') {
            return res.status(400).json({message:"Mobile number is required"})
        }
        let user = await User.findOne({mobile})


        if (!user) {
            user = await User.create({
                mobile
            })
        }


        const {refreshToken, accessToken} = await generateRefreshAndAccessToken(user._id)

        const options = {
            httpOnly:true,
            secure:true
        }
        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                accessToken:accessToken,
                refreshToken:refreshToken
            })
    }
    catch (err) {
        console.log(err)
        return res.status(501).json({success: false, message: "Cannot Register User"})
    }
}

const refreshAccessToken = async (req, res)=>{

    const oldRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!oldRefreshToken || oldRefreshToken === ''){
        return res.status(401).json({success:false, message:"Unauthorized"})
    }

    try{
        const decodeToken = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        if (!decodeToken){
            return res.status(401).json({success:false, message:"Invalid refresh token"})
        }
        const user = await User.findById(decodeToken._id);

        if (!user){
            return res.status(401).json({success:false, message:"Invalid refresh token"})
        }

        if (user.refreshToken !== oldRefreshToken){
            return res.status(401).json({success:false, message:"Refresh Token expired or already in use"})
        }

        const { refreshToken, accessToken } = await generateRefreshAndAccessToken(user._id);

        const options = {
            httpOnly: true,
            secure: true
        }

        res.status(200)
            .cookie("accessToken",accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({success:true,
                message:"Successfully generated new access and refresh token",
                accessToken:accessToken,
                refreshToken:refreshToken
            })
    }
    catch (err){
        console.log(err)
        return res.status(500).json({success:false, message:"Cannot refresh access token"});
    }
}


const logout = async (req, res)=>{
    // From 'chai aur code' :)
    try{
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1 // this removes the field from document
                }
            },
            {
                new: true
            }
        )

        const options = {
            httpOnly:true,
            secure:true
        }

        res.status(200)
            .clearCookie('refreshToken', options)
            .clearCookie('accessToken', options)
            .json({success:true, message:"Successfully logged out"})
    }

    catch(err){
        res.status(500).json({success:false, message:"Cannot logout the user"})
    }
}


const updateProfile = async ( req, res )=>{

    const {name , age, gender, address, state, aadhaar, BPL } = req.body;

    const user = await User.findById(req.user._id);

    if (!req.file?.path) {

        const upload = await uploadOnCloudinary(req.file?.path)

        fs.unlinkSync(req.file?.path)

        if (!upload || !upload.url) return res.status(500).json({
            success: false,
            message: "Error uploading Profile image"
        })
        user.profileUrl = upload.url
    }

    user.name = name;
    user.age = age;
    user.gender = gender;
    user.address = address;
    user.state = state;
    if (aadhaar) user.aadhaar = aadhaar;
    if (BPL) user.BPL = BPL;

    await user.save({validateBeforeSave:false})


    // console.log(user)
    res.status(200).json({success:true, message:"Saved data successfully"});
}

const bookAppointment = async (req, res)=>{

    try{

        const {doctorID, name, age, gender, address} = req.body;
        if (!doctorID) return res.status(400).json({success:false, message:"Send details"});

        const doctor = await DoctorAvailability.findOne({doctorID});

        if (!doctor) return res.status(400).json({success:false, message:"No such doctor found"});
        if (!doctor.isAvailable) return res.status(400).json({success:false, message:"Doctor is currently unavailable"});

        doctor.totalPatients+=1;

        const token = doctor.totalPatients;

        const details = {
            name:name||req.user.name,
            age:age||req.user.age,
            address:address||req.user.address,
            gender:gender||req.user.gender,
            token,
            doctorID,
            userID:req.user._id,
        }

        await Appointment.create(details);

        await doctor.save({validateBeforeSave:true});

        return res.status(200).json({success:true, message:"Successfully appointed the doctor"});

    }

    catch(err){

        console.log(err);
        return res.status(500).json({success:false, message:"Error appointing the doctor"});

    }

}

const getAppointments = async (req, res)=>{

    try{

        const appointments = await Appointment.find({userID:req.user._id});

        for(let i = 0; i < appointments.length; i++){
            const doctor = await DoctorAvailability.findOne({doctorID:appointments[i].doctorID});
            appointments[i]['currToken'] = doctor.token;
        }


        return res.status(200).json({success:true, message:"Successfully fetched the data", data:appointments});

    }

    catch(err){

        console.log(err);
        return res.status(500).json({success:false, message:"Error in accessing the appointments"});

    }

}

const getScheme = async (req, res) => {

    try{

        const schemes = await GovernmentScheme.find(
            {
                $or:[{'state':'all'},{'state':req.user.state}]
            }
        )

        return res.status(200).json({success:true, data:schemes});

    }

    catch(err){
        console.log(err)
        return res.status(500).json({success:false, message:"Cannot get schemes"});

    }

}

const getSchemaHospital = async (req, res)=>{

    try{

        const {scheme} = req.body;
        if (!scheme) return res.status(400).json({success:false, message:"Send government scheme"});
        const hospitals = await Hospital.find({governmentScheme:scheme}).select('_id name about contact address governmentScheme');

        return res.status(200).json({success:true, message:"Successfully retrieved", data:hospitals});
    }
    catch(err){

        console.log(err);
        return res.status(500).json({success:false, message:"Error in fetching the data"});

    }

}

const reportHospital = async (req, res)=>{

    try{

        const {hospitalID, description, requestID} = req.body;
        if (!hospitalID || !description || !requestID) return res.status(400).json({success:false, message:"send full details"});

        await HospitalReport.create({
            userID: req.user._id,
            hospitalID,
            requestID,
        })

        return res.status(200).json({success:true, message:"Successfully reported the hospital"});
    }
    catch(err){
        console.log(err)
        return res.status(500).json({success:true, message:"Error in reporting the hospital"})
    }

}

const getDoctor = async (req, res)=>{
    try{
        const doctors = await Doctor.find();

        return res.status(200).json({success:true, data:doctors});

    }
    catch(err){
        return res.status(500).json({success:false, message:"Cannot fetch doctor list"});
    }
}

const getHospital = async (req, res) =>{
    try{
        const hospitals = await Hospital.find();

        return res.status(200).json({success:true, data:hospitals});

    }
    catch(err){
        return res.status(500).json({success:false, message:"Cannot fetch hospitals list"});
    }
}


const verify = async (req, res) =>{
    const token = req.headers.authorization;

    try{
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return res.status(200).json({success:true});
    }
    catch(err){
        return res.status(401).json({success:false});
    }
}

export {verify, register , refreshAccessToken , logout , updateProfile, bookAppointment, getAppointments, getScheme, getSchemaHospital, reportHospital, getDoctor, getHospital};