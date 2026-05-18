import dotenv from "dotenv";
import express from "express";
import { app } from "./app.js";
import connectDb from "./db/index.js";
import userRoute from "./routes/user.route.js";
import cors from 'cors'

dotenv.config({
  path: "./.env",
})

const PORT = process.env.PORT || 8000;

connectDb()
  .then(() => {
    try {
      app.listen(PORT || 8000, () => {
        console.log(`Server is running at port: ${PORT}`);
      });
    } catch (error) {
      throw new Error(error);
    }
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed", err);
  });
