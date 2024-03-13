import Hospital from "../models/hospital.model.js";
import {EmailOTP} from "../models/emailOtp.model.js";

import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import otpGenerator from 'otp-generator'


const sendOTP = async (req, res)=>{
    console.log(req.body.mail)
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

const login = () => {

}

const hireDoctor = () => {

}

const removeDoctor = () => {

}

const updateDoctorProfile = () => {

}

export {register, sendOTP}