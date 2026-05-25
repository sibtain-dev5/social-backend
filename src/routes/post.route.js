import { Router } from "express"
import { getAllPosts, getCurrentUserPosts, postUpload } from "../controllers/post.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
 
const router = Router()

router.route("/upload").post(
    verifyJWT,
    upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    postUpload
)

router.route("/posts").post(getAllPosts)
router.route("/my-posts").post(verifyJWT, getCurrentUserPosts)


export default router