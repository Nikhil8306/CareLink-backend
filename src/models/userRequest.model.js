import mongoose from 'mongoose';

const userRequestSchema = mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    hospitalID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hospital',
        required:true,
    },
}, {timestamps:true});

export const UserRequest = mongoose.model('UserRequest', userRequestSchema);