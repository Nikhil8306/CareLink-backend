import mongoose from 'mongoose'

const hospitalSchema = mongoose.Schema({

    name: {
        type:String,
        required:true,
    },

    about: {
        type:String,
    },

    operatorName: {
        type:String,
        required:true,
    },

    mail: {
        type:String,
        required:true,
        unique:true,
    },

    longitude: {
        type:Number,
    },

    latitude :{
        type:Number,
    },

    contact: [{
        type:String,
        required:true
    }],

    doctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
    }],

    address: {
        type: String,
        required: true,
    },

    photoUrl: {
        type:String
    },

    verified: {
        type:Boolean,
        default:false,
    },

    password: {
        type:String,
    },

    refreshToken: {
        type:String,
    },

    governmentScheme :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'GovernmentScheme'
    }]
})

export const Hospital = mongoose.model('Hospital', hospitalSchema)
