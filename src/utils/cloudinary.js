import dotenv from "dotenv";
dotenv.config({
  path: "./.env"
});
import { v2 as cloudinary } from "cloudinary" 
import fs from "fs"
import { ApiError } from "./ApiError.js";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log("CLOUD NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API KEY:", process.env.CLOUDINARY_API_KEY);
console.log("SECRET:", process.env.CLOUDINARY_API_SECRET);

const uploadOnCloudinary = async (localFilePath) => {
    try {
        
    if (!localFilePath) return null 

    //upload the file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
    })
     fs.unlinkSync(localFilePath)
    //File Has been uploaded successfully on Cloudinary
    console.log("File is uploaded on CLoudinary", response.url);
    return response


    } catch (error) {
        // remove the locally saved temporary file as the upload operation get failed
        console.log("Cloudinary Upload Error:", error);
        if (fs.existsSync(localFilePath)) {
            
            fs.unlinkSync(localFilePath) 
        }
        return null;
    }
}


export { uploadOnCloudinary }