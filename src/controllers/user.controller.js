import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// access & Refresh token Generation
const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
    
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, error)
    }
    
}

const registerUser = asyncHandler(async (req, res) => {
  //Get User Details from User
  const { userName, email, fullName, password } = req.body;

  //Fields Validation

  if (
    [userName, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Full Name Is Requried");
  }

  // check if user is already exist by userName & email
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with Email & userName Already Exists!");
  }

  // create user object create entry in db

  const user = await User.create({
    userName: userName.toLowerCase(),
    email,
    fullName,
    password,
  });

  //remove password & refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //check for user creation
  if (createdUser) {
    throw new ApiError("500", "Something Wrong While Registering the user");
  }

  //return res
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Register Successfully!"));
});

const refreshAccessToken = asyncHandler(async(req, res) => {
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized Request")
   }

   try {
       const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
   )

   const user = User.findById(decodedToken?._id)
   if (!user) {
      throw new ApiError(401, "Invalid Refresh Token")
   }

   if (incomingRefreshToken !== user?.refreshToken ) {
    throw new ApiError(401, "Refresh token is expired & used");
   }

   const options = {
    httpOnly: true,
    secure: true
   }
   const {accessToken, newRefreshToken} = await
   await generateAccessAndRefreshTokens(user._id)

   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", newRefreshToken, options)
   .json(
    new ApiResponse(
      200, 
      {accessToken, refreshToken: newRefreshToken},
      "Access Token Refreshed"
    )
   )
   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
    
   }

  })

export { registerUser, refreshAccessToken};
