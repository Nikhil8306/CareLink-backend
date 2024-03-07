import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import User from '../models/user.model.js'

const generateRefreshAndAccessToken = async (_id) => {

    const refreshToken = await jwt.sign({

        _id:_id

    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXP
        })

    const accessToken = await jwt.sign({
            _id:_id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXP
        })


    const user = await User.findById(_id);
    user.refreshToken = refreshToken

    await user.save({validateBeforeSave:false})

    return { refreshToken , accessToken };
}


const register = async (req, res)=>{
    try{
        const mobile = req.body.mobile;
        if (!mobile || mobile === '') {
            return res.status(400).json({message:"Mobile number is required"})
        }
        let user = await User.create({
            mobile
        })

        const {refreshToken, accessToken} = await generateRefreshAndAccessToken(user._id)


        res.status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", refreshToken)
            .json({
                success: true,
                accessToken:accessToken,
                refreshToken:refreshToken
            })
    }
    catch (err) {
        console.log(err)
        return res.status(501).json({success: false, message: "Cannot Register User"})
    }

}





export { register }