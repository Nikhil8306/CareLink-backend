import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const auth = async (req, res, next)=>{

    try{
        const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "");

        if (!token || token === '') {
            return res.status(401).json({success: false, message: "Unauthorized"})
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeToken?._id);

        if (!user){
            return res.status(401).json({success:false, message:"Unauthorized user id"})
        }

        if (!user.name){
            return res.status(406).json({success:false, message:"Fill up the details of user"})
        }

        req.user = user.select("-profileUrl -refreshToken")

        console.log("User details = ", req.user);

        next();
    }

    catch(error){
        console.log("Something went wrong check authorization : ", error)
    }

    res.status(500).json({success:false, message: "Cannot Authorize"})
}

export default auth;