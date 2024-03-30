import GovernmentScheme from "../models/governmentScheme.model.js";
import {HospitalReport} from "../models/hospitalReport.model.js";
import jwt from "jsonwebtoken";

const hospitalReport = async (req, res)=>{
    try{
        const reports = await HospitalReport.find();
    }

    catch(err){
        return res.status(500).json({success:false, message:"Error in getting hospital reports"})
    }
}

const hospitalClaim = (req, res)=>{

}


export {hospitalClaim, hospitalReport};
