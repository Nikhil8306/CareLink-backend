import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
    otp:{
        type:String,
    },

    mail:{
        type:String,
    },

    expiredAt:{
        type: Date,
        expires: 300,
        default: Date.now
    }
})

export const EmailOTP = mongoose.model("EmailOTP", otpSchema);