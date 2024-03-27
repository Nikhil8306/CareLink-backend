import mongoose from 'mongoose'

const govSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    about:{
        type:String,
    },
    ageStart:{
        type:Number,
    },
    ageEnd:{
        type:Number,
    }
})

const GovernmentScheme = mongoose.model('GovernmentScheme', govSchema)

export default GovernmentScheme;