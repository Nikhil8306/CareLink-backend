import mongoose from 'mongoose'

const doctorSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

    age:{
        type:Number,
    },

    gender:{
        type:String,
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
    }],

    EID:{
        type:String,
        unique:true,
    },

    password:{
        type:String,
    },

    hospitalID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hospital',
    }

})

export const Doctor = mongoose.model('Doctor',doctorSchema);