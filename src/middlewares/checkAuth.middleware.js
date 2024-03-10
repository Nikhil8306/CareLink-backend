import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const auth = async (req, res, next)=>{

    try{
        const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "");

        if (!token || token === '') {
            return res.status(401).json({success: false, message: "Unauthorized"})
        }


        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);


        const user = await User.findById(decodeToken?._id).select("-profileUrl -refreshToken");

        if (!user){
            return res.status(401).json({success:false, message:"Unauthorized user id"})
        }

        req.user = user


        next();
    }

    catch(error){
        res.status(401).json({success:false, message: "Unauthorized request"})
    }


}

export default auth;