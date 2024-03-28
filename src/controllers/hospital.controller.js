import {Hospital} from "../models/hospital.model.js";
import {Doctor} from "../models/doctor.model.js";
import {EmailOTP} from "../models/emailOtp.model.js";
import {Accountant} from "../models/accountant.model.js";
import {DoctorAvailability} from "../models/doctorAvailability.model.js";

import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import otpGenerator from 'otp-generator'
import jwt from "jsonwebtoken";
import {mail_html} from "../constants.js";


const generateRefreshAndAccessToken = async (_id) => {

    const refreshToken = await jwt.sign({

            _id:_id

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.H_REFRESH_TOKEN_EXP
        })

    const accessToken = await jwt.sign({
            _id:_id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.H_ACCESS_TOKEN_EXP
        })


    const hospital = await Hospital.findById(_id);

    hospital.refreshToken = refreshToken

    await hospital.save({validateBeforeSave:false})


    return { refreshToken , accessToken };
}


const sendOTP = async (req, res)=>{

    if (!req.body.mail) {
        return res.status(400).json({success:false, message:"Provide email"})
    }

    try{
        const generatedOtp = otpGenerator.generate(4, {
            lowerCaseAlphabets:false,
            upperCaseAlphabets:false,
            specialChars:false
        });

        const alreadySent = await EmailOTP.findOne({mail:req.body.mail})
        if (alreadySent){
            await EmailOTP.deleteOne({mail:req.body.mail})
        }
        await EmailOTP.create({
            mail:req.body.mail,
            otp:generatedOtp,
        })

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nikhil.k.test.mail@gmail.com',
                pass: 'pdmh qrdt uqdf ydus',
            }
        });

        const mailOptions = {
            from: 'nikhil.k.test.mail@gmail.com',
            to: req.body.mail,
            subject: 'Verify your email address',
            text: `Here is your approval code : ${generatedOtp}, Use it within 5 minutes!!!`,
            html:mail_html(generatedOtp)
        }

        transporter.sendMail(mailOptions);

        return res.status(200).json({success:true, message:"OTP sent successfully"})
    }

    catch(err){
        console.log("Error in sending the otp to mail : ", err);
        return res.status(500).json({success:false, message:"Error in sending the otp"});
    }
}


const register = async (req, res)=> {
    let {name, mail, about, operatorName, operatorMobile, contact, address, longitude, latitude, password, otp} = req.body;

    if ([name, mail, about, operatorName, operatorMobile, contact, address, longitude, latitude].includes(undefined)){
        return res.status(400).json({success:false, message:"Please fill up the details"})
    }

    try{
        const registeredHospital = await Hospital.findOne({mail});

        if (registeredHospital){
            return res.status(409).json({success:false, message:"This email is already in use"});
        }
        const otpVerification = await EmailOTP.findOne({mail});

        if (!otpVerification){
            return res.status(410).json({success:false, message:"OTP expired"})
        }

        if (otpVerification.otp !== otp) {
            return res.status(401).json({success:false, message:"Incorrect OTP"});
        }
        password = password.trim()

        password = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND));
        name = name.trim()
        mail = mail.trim()
        operatorName = operatorName.trim()

        const newHospital = new Hospital({
            name,
            mail,
            about,
            operatorName,
            operatorMobile,
            contact,
            address,
            longitude,
            latitude,
            password
        })

        await newHospital.save()

        return res.status(200).json({success:true, message:"Hospital registered successfully"});
    }

    catch(err){
        console.log("Error registering hospital: ", err)
        return res.status(500).json({success:false, message:"Cannot register!!"})
    }
}

const login = async (req, res) => {

    try{
        const {mail, password} = req.body;
        if (!mail || !password) return res.status(400).json({success: false, message: "Insufficient data"});

        const hospital = await Hospital.findOne({mail});
        if (!hospital) return res.status(400).json({success: false, message: "Email not registered"});

        const passCheck = await bcrypt.compare(password, hospital.password);
        if (!passCheck) return res.status(401).json({success: false, message: "Password is incorrect"});

        const {refreshToken, accessToken} = await generateRefreshAndAccessToken(hospital._id);

        const options = {
            httpOnly: true,
            secure: true
        }

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({success: true, message: "Logged in successfully"});
    }

    catch(err){
        console.log("Error in logging in : ", err);
        res.status(500).json({success:false, message:"Error in logging in"});
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
        const hospital = await Hospital.findById(decodeToken._id);

        if (!hospital){
            return res.status(401).json({success:false, message:"Invalid refresh token"})
        }

        if (hospital.refreshToken !== oldRefreshToken){
            return res.status(401).json({success:false, message:"Refresh Token expired or already in use"})
        }

        const { refreshToken, accessToken } = await generateRefreshAndAccessToken(hospital._id);

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

const hireDoctor = async (req, res) => {
    // console.log(req.body);
    try{
        const {name, age, qualifications, experience, specializations, contact, gender, roomNo} = req.body;

        if (!name || !age || !qualifications || !experience || !specializations || !contact || !gender || !roomNo){
            return res.status(400).json({success:false, message:"Insufficient data"});
        }

        const EID = otpGenerator.generate(6,{
            lowerCaseAlphabets:true,
            upperCaseAlphabets:true,
            specialChars:true,
        })

        const doctor = await Doctor.create({
            name,
            age,
            qualifications,
            experience,
            specializations,
            contact,
            gender,
            EID,
        })

        await DoctorAvailability.create({
            doctorID: doctor._id,
            roomNo,
        })

        const hospital = await Hospital.findById(req.hospital._id);

        hospital.doctors.push(doctor._id);

        await hospital.save({validateBeforeSave:false})

        return res.status(200).json({success:true, message:"Doctor data saved successfully"})
    }
    catch(err){
        console.log("Error in saving doctor data : ", err);
        return res.status(500).json({sucess:false, message:"Cannot save doctor data"});
    }
}
const removeDoctor = async (req, res) => {

    try{

        const {doctorID} = req.body;
        if (!doctorID) return res.status(400).json({success:false, message:"Insufficient data"});

        if (!await DoctorAvailability.deleteOne({doctorID}) || !await Doctor.findByIdAndDelete(doctorID))
            return res.status(404).json({success:false, message:"No such doctor found"});

        const hospital = await Hospital.findById(req.hospital._id);
        hospital.doctors.splice(hospital.doctors.indexOf(doctorID), 1);
        hospital.save({validateBeforeSave:false});

        return res.status(200).json({success:true, message:"Successfully removed the doctor"});

    }

    catch (err){
        console.log(err);
        return res.status(500).json({success:false, message:"Error removing doctor from the list"});
    }

}

const updateDoctorProfile = () => {

}


const addAccountant = async (req, res) => {
    try{
        if (!req.body.deviceNo) return res.status(400).json({success:false, message:"Send device number"});

        const UID = otpGenerator.generate(10, {
            lowerCaseAlphabets:true,
            upperCaseAlphabets:true,
            specialChars:true
        });

        await Accountant.create({
            UID,
            deviceNo : req.body.deviceNo,
            hospitalID:req.hospital._id,
        });


        return res.status(200).json({success:false, UID, message:"Successfully created accountant id"});
    }

    catch(err) {
        console.log(err);
        return res.status(500).json({success: false, message: "Error in generating new accountant id"})
    }
}

const removeAccountant = (req, res)=>{

    try{

    }

    catch(err){

    }

}


export {register, sendOTP, login, hireDoctor, refreshAccessToken, addAccountant, removeDoctor}