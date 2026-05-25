import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; 


const postUpload = asyncHandler ( async (req, res) => {
    const userId = req.user?._id;
  
    //Get Posts Data From Frontend
    const {title, description, image} = req.body

    // Validation of the fields
    if (
        [title, description].some((field)=>field?.trim() === "")
    ) {
        throw new ApiError(400, "All Fields are required")
    }
    console.log(req.files);
console.log(req.body);
    // Check for the image
    
    const imageLocalPath = req.files?.image?.[0]?.path;

    if(!imageLocalPath) {
        throw new ApiError(400, "Image is Required!");
    }

    // Upload on Cloudinary

    const imageUpload = await uploadOnCloudinary(imageLocalPath)
    
    if (!imageUpload) {
      throw new ApiError(400, "Image is not uploaded on Cloudinary")
    }

    // Check likes and dislikes on post
    // Create post object - create entry in db
    const updatedPost = await Post.create({
        title,
        description,
        image: imageUpload?.url || "",
        author: userId
    })

    // return response
  return res
    .status(201)
    .json(new ApiResponse(200, updatedPost, "Post uploaded Successfully!"));
  });

const getAllPosts = asyncHandler(async(req, res) => {
  const posts = await Post.find().sort({createdAt: -1})

  if (!posts) {
    throw new ApiError(404, "No posts found!");
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, posts, "All posts fetched successfully")
  );

})


// const getAllPosts = asyncHandler(async(req, res) => {
  
//   const userId = req.user?._id;
//   const posts = await Post.aggregate([
//     {
//       $sort: {
//         createdAt: -1
//       }
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "author",
//         foreignField: "_id",
//         as: "author"
//       }
//     },
//     {
//       $unwind: "$author"
//     },
//     {
//       $addFields: {
//        likesCount: {
//         $size: "$like"
//        },
//        isLiked: {
//         $in: [userId, "$like"]
//        }
//       }
//     },
//     {
//       $project: {

//         title: 1,
//         description: 1,
//         image: 1,
//         createdAt: 1,

//         likesCount: 1,
//         isLiked: 1,

//         "author._id": 1,
//         "author.username": 1,
//         "author.fullname": 1,
//         "author.avatar": 1
//       }
//     }
//   ])

//   return res
//   .status(200)
//   .json(
//     new ApiResponse(200, posts, "All posts fetched successfully")
//   );

// })

const updatePostImage = asyncHandler(async (req, res) => {

  const imageLocalPath = req.file?.path

  if(!imageLocalPath){
    throw new ApiError(400, "Image File is missing");
  }

  const image = await uploadOnCloudinary(imageLocalPath)

  if(!image.url) {
    throw new ApiError(400, "Error while uplaoding on Image");
  }

  const post = await Post.findByIdAndUpdate(req.post._id,
    {
      $set:{
        image: image.url
      }
    },
    {
       returnDocument: "after" 
    },
  ).select("-title -description")

   return res
    .status(200)
    .json(new ApiResponse(200, post, "Post Image Updated"));



})

const getCurrentUserPosts = asyncHandler(async(req, res) => {
    const userId = req.user?._id;

    const posts = await Post.find({
      author: userId
    }).sort({createdAt: -1})

    if (posts.length === 0) {
      throw new ApiError(404, "Users don't have any post");
      
    }

    return res
    .status(200)
    .json(new ApiResponse(200, posts, "Current user posts fetched successfully" ))
})


export { postUpload, updatePostImage, getAllPosts, getCurrentUserPosts }