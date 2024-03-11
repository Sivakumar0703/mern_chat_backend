import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME ,
    api_key:process.env.API_KEY ,
    api_secret: process.env.API_SECRET ,
    secure:true
})

export const generateSignature = (req,res) => {
    const {folder} = req.body;

    try {
       const timestamp = Math.round((new Date).getTime() / 1000);
       const signature = cloudinary.utils.api_sign_request({
        timestamp,
        folder
       },process.env.API_SECRET) ;
       console.log(" ☁️ cloudinary" , signature)
       res.status(200).json({timestamp,signature,message:"successfully signature generated"})
    } catch (error) {
        res.status(500).json({message:"Internal Server Error in signature generation backend"})
    }
}