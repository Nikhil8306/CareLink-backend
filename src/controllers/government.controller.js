import GovernmentScheme from "../models/governmentScheme.model.js";

const addScheme = async (req, res)=>{
    console.log("Someone requested")
    const {name, about, state} = req.body;
    await GovernmentScheme.create({
        name,
        about,
        state,
    })

    res.status(200).json({success:true});
}

export {addScheme}