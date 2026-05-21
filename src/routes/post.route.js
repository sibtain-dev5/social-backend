import { Router } from "express"
import { postUpload } from "../controllers/post.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
 
const router = Router()

router.route("/upload").post(
    upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    postUpload
)

export default router