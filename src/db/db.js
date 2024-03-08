import mongoose from 'mongoose'

const connectDB = async ()=> {

    try{
        const dbInstance = mongoose.connect(`${process.env.MONGODB_URI}/CareLink`);
    }
    catch (err){
        console.log("MongoDB connection error : ", err)
    }
}

export default connectDB