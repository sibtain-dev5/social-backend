import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// access & Refresh token Generation
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error);
  }
};

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired & used");
    }

    const Options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, Options)
      .cookie("refreshToken", newRefreshToken, Options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  //Get User Details from frontend
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
  if (!createdUser) {
    throw new ApiError("500", "Something Wrong While Registering the user");
  }

  //return res
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Register Successfully!"));
});

const loginUser = asyncHandler(async (req, res) => {
  //get data from user

  const { userName, email, password } = req.body;

  //username or email
  if (!userName && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  //find the user

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  //check passsword

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(404, "Password Incorrect");
  }

  //access and refresh token generation

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loginUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //send cookie
  const Options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, Options)
    .cookie("refreshToken", refreshToken, Options)
    .json(
      new ApiResponse(
        200,
        {
          user: loginUser,
          accessToken,
          refreshToken,
        },
        "User Logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: {
      refreshToken: 1,
    },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user Logged Out!"));
});

const changeCurrentUserPassword = asyncHandler(async (req, res) => {
 
  const { oldPassword, newPassword, confirmPassword } = req.body;
 
  if (!(newPassword === oldPassword)) {
    throw new Error(400, "New Password & Old Password are not same!");
  }
 
  const user = await User.findById(req.user?._id);
 
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Password!");
  }

  user.password = newPassword;
 
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password has been changed successfully!"));
});

const getCurrentUser = asyncHandler( async (req, res) => {

   return res
    .status(200)
    .json(200, req.user, "Current user fetched successfully!");

})

const updateAccountDetails = asyncHandler (async (req, res) => {

  const {fullName, email} = req.body

  if (!fullName || !email ) {
    throw new ApiError(400, "Full Name & Email are not available");
  }

  User.findByIdAndUpdate(req.user?._id,
    {
    $set: {
      fullName: fullName,
      email: email
    }
  },
  { 
    returnDocument: "after"
   }
  ).select("-password")
return res
.status(200)
.json(new ApiResponse(200, user, "Account Details Updated Successfully!"))

})




export { registerUser, loginUser, refreshAccessToken, logoutUser, changeCurrentUserPassword, getCurrentUser, updateAccountDetails };
