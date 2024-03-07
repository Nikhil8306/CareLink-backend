import mongoose from 'mongoose'

const userSchema = mongoose.Schema({

    firstName : {
        type:String,
    },
    lastName : {
        type:String,
    },
    age : {
        type:Number,
    },
    mobile : {
        type:String,
        required:true
    },
    gender : {
        type:String,
        enum:["male", "female", "other"]
    },
    profileUrl : {
        type:String
    }
})

const User = mongoose.model("User", userSchema);

export default User