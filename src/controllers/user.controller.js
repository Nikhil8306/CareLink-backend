import jwt from 'jsonwebtoken'

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
        let user = await User.findOne({mobile})


        if (!user) {
            user = await User.create({
                mobile
            })
        }


        const {refreshToken, accessToken} = await generateRefreshAndAccessToken(user._id)

        const options = {
            httpOnly:true,
            secure:true
        }
        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
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

const refreshAccessToken = async (req, res)=>{

    const oldRefreshToken = req.body.refreshToken;

    if (!oldRefreshToken || oldRefreshToken === ''){
        return res.status(401).json({success:false, message:"Unauthorized"})
    }

    try{
        const decodeToken = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        if (!decodeToken){
            return res.status(401).json({success:false, message:"Invalid refresh token"})
        }
        const user = await User.findById(decodeToken._id);

        if (!user){
            return res.status(401).json({success:false, message:"Invalid refresh token"})
        }

        if (user.refreshToken !== oldRefreshToken){
            return res.status(401).json({success:false, message:"Refresh Token expired or already in use"})
        }

        const { refreshToken, accessToken } = await generateRefreshAndAccessToken(user._id);

        const options = {
            httpOnly: true,
            secure: true
        }

        res.status(200)
            .cookie("accessToken",accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({success:true,
                message:"Successfully generated new access and refresh token",
                accessToken:accessToken,
                refreshToken:refreshToken
            })
    }
    catch (err){
        console.log(err)
        return res.status(500).json({success:false, message:"Cannot refresh access token"});
    }

}



export { register , refreshAccessToken }