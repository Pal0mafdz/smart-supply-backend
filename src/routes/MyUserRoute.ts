import express from "express";
import MyUserController from "../controllers/MyUserController";
import {jwtCheck, jwtParse} from "../middleware/auth"

const router = express.Router();

router.post("/", jwtCheck, MyUserController.createCurrentUser);
router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser);
router.get("/users", jwtCheck, jwtParse, MyUserController.getUsers);
router.put("/", jwtCheck, jwtParse, MyUserController.updateUserRole);

 

export default router;