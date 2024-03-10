import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'

const configureCloudinary = ()=>{
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    });
}

const uploadOnCloudinary = async (filePath) => {

    try{
        if (!filePath) return null;
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto'
        })

        return response;
    }
    catch(err){
        fs.unlinkSync(filePath)
        console.log("Error uploading file on cloudinary");
        return null;
    }

}

export {uploadOnCloudinary , configureCloudinary};