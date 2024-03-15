import mongoose from 'mongoose'

const doctorSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

    age:{
        type:Number,
    },

    contact:{
        type:Number,
        required:true,
    },

    profileUrl: {
        type:String,
    },

    experience:{
        type:Number,
        default:0
    },

    qualifications:[{
        type:String,
    }],

    specializations:[{
        type:String
    }]
})

export const Doctor = mongoose.model('Doctor',doctorSchema);