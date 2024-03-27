import mongoose from 'mongoose'

const doctorAvailabilitySchema = mongoose.Schema({
    doctorID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
    },

    roomNo:{
        type:Number,
    },

    isAvailable:{
        type:Boolean,
        default:false,
    },

    token:{
        type:Number,
    },
})

export const DoctorAvailability = mongoose.model('DoctorAvailability', doctorAvailabilitySchema);