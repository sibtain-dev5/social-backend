import { Router } from "express"
import { postUpload } from "../controllers/post.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
 
const router = Router()

router.route("/upload").post(
    upload.fields([
        {image}
    ],
    postUpload
))