import Hospital from "../models/hospital.model.js";
import {EmailOTP} from "../models/emailOtp.model.js";

import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import otpGenerator from 'otp-generator'
import jwt from "jsonwebtoken";


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
            text: `Here is your approval code : ${generatedOtp}, Use it within 5 minutes!!!`
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

const hireDoctor = () => {

}

const removeDoctor = () => {

}

const updateDoctorProfile = () => {

}

export {register, sendOTP, login}