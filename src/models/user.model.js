import mongoose from 'mongoose'

const userSchema = mongoose.Schema({

    name : {
        type:String,
    },
    age : {
        type:Number,
    },
    mobile : {
        type:String,
        required:true,
        unique:true
    },
    gender : {
        type:String,
        enum:["male", "female", "other"]
    },
    profileUrl : {
        type:String
    },
    refreshToken : {
        type:String,
    },
    address:{
        type:String,
    },
    state:{
      type:String,
    },
    aadhaar:{
        type:String,
    },
    BPL:{
        type:String,
    }
    
})

const User = mongoose.model("User", userSchema);

export default User