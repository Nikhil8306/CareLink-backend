import mongoose from 'mongoose'

const accountantSchema = mongoose.Schema({

    UID:{
        type:String,
        unique:true,
    },

    deviceNo:{
        type:Number,
        required:true
    },

    hospitalID: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hospital'
    },

    inUse:{
        type:Boolean,
        default:false
    }

});

export const Accountant = mongoose.model('Accountant', accountantSchema);