import mongoose from 'mongoose'

const appointmentSchema = mongoose.Schema({
    doctorID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
    },

    hospitalID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hospital',
    },

    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },

    name:{
        type:String,
        required:true,
    },

    token:{
        type:Number,
        required:true,
    },

    age:{
        type:Number,
        required:true,
    },

    address:{
        type:String,
        required:true,
    },

    gender:{
        type:String,
        required:true,
    },

});

export const Appointment = mongoose.model('Appointment', appointmentSchema);