import twilio from 'twilio'
import {Doctor} from "../models/doctor.model.js";

const sendOTP = (req, res)=>{
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, {lazyLoading:true})
    try{
        let {countryCode , mobile} = req.body;
        if (!countryCode) countryCode = 91
        if (!mobile){
            return res.status(400).json({success:true, message:"Please send mobile number!!"});
        }

        client.verify.v2.services(process.env.TWILIO_SERVICE_SID).verifications.create({
            to:`+${countryCode}${mobile}`,
            channel: 'sms',
        }).then(()=>{

            return res.status(200).json({success:true, message:"OTP sent successfully"});

        }).catch((err)=>{
            return res.status(500).json({success:false, message:"Cannot send otp from backend"})
        })
    }

    catch(error){
        console.log("Something went wrong sending otp : ", error);
        return res.status(500).json({sucess:false, message:"Something went wrong"});
    }
}

const sendDoctorOTP = async (req, res)=>{
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, {lazyLoading:true})
    try{
        const {EID} = req.body;
        if (!EID) return res.status(400).json({success:false, message:"Please send EID"});

        const doctor = await Doctor.findOne({EID});
        if (!doctor) return res.status(401).json({success:false, message:"Incorrect EID"});

        const mobile = doctor.contact;

        const countryCode = 91
        if (!mobile){
            return res.status(400).json({success:false, message:"Please send mobile number!!"});
        }

        client.verify.v2.services(process.env.TWILIO_SERVICE_SID).verifications.create({
            to:`+${countryCode}${mobile}`,
            channel: 'sms',
        }).then(()=>{

            return res.status(200).json({success:true, message:"OTP sent successfully"});

        }).catch((err)=>{
            return res.status(500).json({success:false, message:"Cannot send otp from backend"})
        })
    }

    catch(error){
        console.log("Something went wrong sending otp : ", error);
        return res.status(500).json({sucess:false, message:"Something went wrong"});
    }
}

const verifyDoctorOTP = async ( req, res, next )=>{

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, {lazyLoading:true})
    try{
        const {EID, otp} = req.body;
        if (!EID) return res.status(400).json({success:false, message:"Please send EID"});

        const doctor = await Doctor.findOne({EID});
        if (!doctor) return res.status(401).json({success:false, message:"Incorrect EID"});

        const mobile = doctor.contact;

        const countryCode = 91
        if (!mobile){
            return res.status(400).json({success:false, message:"Please send mobile number!!"});
        }
        if (!otp){
            return res.status(400).json({success:false, message:"Please send otp"})
        }

        client.verify.v2.services(process.env.TWILIO_SERVICE_SID).verificationChecks.create({
            to:`+${countryCode}${mobile}`,
            code:otp,
        })
            .then(function(data){
                if (data.status === 'approved'){
                    next()
                }
                else{
                    return res.status(401).json({sucess:false, message:"Incorrect OTP"})
                }
            })
            .catch((err)=>{
                return res.status(500).json({succes:false, message:"Error verifying otp"})
            })
    }

    catch(error){
        console.log("Something went wrong verifying otp : ", error);
        return res.status(500).json({sucess:false, message:"Something went wrong"});
    }


}
const verifyOTP =  ( req, res, next )=>{

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, {lazyLoading:true})
    try{
        let {countryCode , mobile, otp} = req.body;
        if (!countryCode) countryCode = 91
        if (!mobile){
            return res.status(400).json({success:false, message:"Please send mobile number!!"});
        }
        if (!otp){
            return res.status(400).json({success:false, message:"Please send otp"})
        }

        client.verify.v2.services(process.env.TWILIO_SERVICE_SID).verificationChecks.create({
            to:`+${countryCode}${mobile}`,
            code:otp,
        })
            .then(function(data){
                if (data.status === 'approved'){
                    next()
                }
                else{
                    return res.status(401).json({sucess:false, message:"Incorrect OTP"})
                }
            })
            .catch((err)=>{
                return res.status(500).json({succes:false, message:"Error verifying otp"})
            })
    }

    catch(error){
        console.log("Something went wrong verifying otp : ", error);
        return res.status(500).json({sucess:false, message:"Something went wrong"});
    }


}

export {sendOTP , verifyOTP, sendDoctorOTP, verifyDoctorOTP}