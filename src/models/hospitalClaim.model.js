import mongoose from 'mongoose'

const hospitalClaimSchema = mongoose.Schema({

    requestID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'PatientRequest',
        required:true,
    },

    hospitalID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hospital',
        required:true,
    },

    billings:[{
        type:String,
    }],

    amount:{
        type:Number,
    },

    description:{
        type:String,
    }

})

export const HospitalClaim = mongoose.model('HospitalClaim', hospitalClaimSchema);