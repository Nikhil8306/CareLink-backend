import mongoose from 'mongoose'

const govSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    about:{
        type:String,
    },
    state:{
        type:String,
    },

})

const GovernmentScheme = mongoose.model('GovernmentScheme', govSchema)

export default GovernmentScheme;