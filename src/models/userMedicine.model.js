import mongoose from 'mongoose'

const userMedicineScheme = mongoose.Schema({

    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },

    medicines:[{
        type:String,
    }]


}, {timestamps:true});

export const UserMedicine = mongoose.model('UserMedicine', userMedicineScheme);
