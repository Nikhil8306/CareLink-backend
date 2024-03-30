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

    patientConsent:{
        type:String,
    },

    description:{
        type:String,
    }

})