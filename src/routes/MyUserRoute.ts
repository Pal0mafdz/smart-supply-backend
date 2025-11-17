import express from "express";
import MyUserController from "../controllers/MyUserController";
import {jwtCheck, jwtParse} from "../middleware/auth"
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits:{
        fileSize: 5 * 1024 * 1024, //5mb
    }
})

router.post("/", jwtCheck, MyUserController.createCurrentUser);
router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser);
router.get("/users", jwtCheck, jwtParse, MyUserController.getUsers);
router.put("/", jwtCheck, jwtParse, MyUserController.updateUserRole);
router.put(
    "/user/profile",
    jwtCheck,
    jwtParse,
    upload.single("image"),
    MyUserController.updateCurrentUser
  );

 

export default router;