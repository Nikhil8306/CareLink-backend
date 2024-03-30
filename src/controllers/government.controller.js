import GovernmentScheme from "../models/governmentScheme.model.js";
import {HospitalReport} from "../models/hospitalReport.model.js";
import jwt from "jsonwebtoken";
import {Hospital} from "../models/hospital.model.js";
import {UserRequest} from "../models/userRequest.model.js";

import {uploadOnCloudinary} from "../util/cloudinary.util.js";
import {HospitalClaim} from "../models/hospitalClaim.model.js";

const addSchema = async (req, res)=>{

    await GovernmentScheme.create({
        name:req.body.name,
        about:req.body.about,
        state:req.body.state,
    })

    return res.status(200).json({success:true});
}
const hospitalReport = async (req, res)=>{
    try{
        let reports = await HospitalReport.find().limit(10);

        for(let i = 0; i < reports.length; i++){

            let currHos = await Hospital.findById(reports[i].hospitalID);
            let request = await UserRequest.findById(reports[i].requestID);
            let user = await User.findById(request.userID);

            reports[i].hospitalName = currHos.name;
            reports[i].operatorName = currHos.operatorName;
            reports[i].operatorMobile = currHos.operatorMobile;
            reports[i].userName = user.name;
            reports[i].reportTime = request.createdAt;
        }

        return res.status(200).json({success:true, data:reports});
    }
    catch(err){
        return res.status(500).json({success:false, message:"Error in getting hospital reports"})
    }
}



const hospitalClaim = (req, res)=>{
    try{

    }
    catch(err){

    }
}

export {addSchema, hospitalClaim, hospitalReport};
