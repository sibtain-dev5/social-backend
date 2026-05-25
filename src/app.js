import cors from "cors";
import helmet from "helmet";
import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(helmet());

//Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

export { app };
