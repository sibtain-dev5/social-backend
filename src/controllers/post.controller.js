import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const postUpload = asyncHandler ( async (req, res) => {
   
    //Get Posts Data From Frontend
    const {title, description, image} = req.body


    // Validation of the fields
    if (
        [title, description, image].some((field)=>field?.trim() === "")
    ) {
        
    }

    // Check if the post title is already exists
    // Check for the image
    // Upload on Cloudinary
    // Check likes and dislikes on post
    // Create post object - create entry in db
    // check for user creation
    // return response
})

export { postUpload }