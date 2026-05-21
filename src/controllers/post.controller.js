import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";

const postUpload = asyncHandler ( async (req, res) => {
   
    //Get Posts Data From Frontend
    const {title, description, image} = req.body


//     // Validation of the fields
//     if (
//         [title, description, image].some((field)=>field?.trim() === "")
//     ) {
//         throw new ApiError(400, "All Fields are required")
//     }
//     // Check if the post title is already exists
//     const existedPost = Post.findOne({title})
//     if(existedPost){
//         throw new ApiError(409, "Posts are already available");        
//     }
    
//     // Check for the image
    
//     const imageLocalPath = req.files?.image[0]?.path;

//     if(!imageLocalPath) {
//         throw new ApiError(400, "Image is Required!");
//     }

//     // Upload on Cloudinary

//     const imageUpload = await uploadOnCloudinary(imageLocalPath)

//     // Check likes and dislikes on post
//     // Create post object - create entry in db
//     Post.create({
//         title,
//         description,
//         image: imageUpload?.url || "",
//         author: req.user._id
//     })

//     // check for user creation

//     // return response
  return res
    .status(201)
    .json(new ApiResponse(200, Post, "Post uploaded Successfully!"));
});



// const updatePostImage = asyncHandler(async (req, res) => {

//   const imageLocalPath = req.file?.path

//   if(!imageLocalPath){
//     throw new ApiError(400, "Image File is missing");
//   }

//   const image = await uploadOnCloudinary(imageLocalPath)

//   if(!image.url) {
//     throw new ApiError(400, "Error while uplaoding on Image");
//   }

//   await Post.findByIdAndUpdate(req.post._id,
//     {
//       $set:{
//         image: image.url
//       }
//     },
//     {
//        returnDocument: "after" 
//     },
//   ).select("-title -description")

  //  return res
  //   .status(200)
  //   .json(new ApiResponse(200, post, "Post Image Updated"));



// })




export { postUpload, updatePostImage }