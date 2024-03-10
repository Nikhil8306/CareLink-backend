import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import {uploadOnCloudinary} from "../util/cloudinary.util.js";
import fs from 'fs'

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


const logout = async (req, res)=>{
    // From 'chai aur code' :)
    try{
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1 // this removes the field from document
                }
            },
            {
                new: true
            }
        )

        const options = {
            httpOnly:true,
            secure:true
        }

        res.status(200)
            .clearCookie('refreshToken', options)
            .clearCookie('accessToken', options)
            .json({success:true, message:"Successfully logged out"})
    }

    catch(err){
        res.status(500).json({success:false, message:"Cannot logout the user"})
    }
}


const updateProfile = async ( req, res )=>{

    const {name , age, gender } = req.body;

    const user = await User.findById(req.user._id);

    if (!req.file?.path) return res.status(500).json({sucess:false, message:"Error uploading profile"})

    const upload = await uploadOnCloudinary(req.file?.path)

    fs.unlinkSync(req.file?.path)

    if (!upload || !upload.url) return res.status(500).json({success:false, message:"Error uploading Profile image"})

    user.name = name;
    user.age = age;
    user.gender = gender;
    user.profileUrl = upload.url

    await user.save({validateBeforeSave:false})


    // console.log(user)
    res.status(200).json({success:true, message:"Saved data successfully"});
}


export { register , refreshAccessToken , logout , updateProfile }