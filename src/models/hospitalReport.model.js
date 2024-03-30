import mongoose from 'mongoose'

const hospitalReportSchema = mongoose.Schema({

    hospitalID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hospital',
        required:true,
    },

    requestID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'PatientRequest',
        required:true,
    },

    description:{
        type:String,
        required:true,
    }

})

export const HospitalReport = mongoose.Model('HospitalReport', hospitalReportSchema);