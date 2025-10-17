import express from "express";
import {jwtCheck, jwtParse} from "../middleware/auth"
import RecipeController from "../controllers/RecipeController";
import multer from "multer";
// import CategoryMenuController from "../controllers/CategoryMenuController";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits:{
        fileSize: 5 * 1024 * 1024, //5mb
    }
})

router.post("/", upload.single("image"), RecipeController.addRecipe);
router.get("/", jwtCheck, jwtParse, RecipeController.getRecipes);
router.put("/:id", jwtCheck, jwtParse, RecipeController.editRecipe);
router.delete("/:id", jwtCheck, jwtParse, RecipeController.deleteRecipes);

// router.post("/menu-category", jwtCheck, jwtParse, CategoryMenuController.addCategoryMenu);
// router.delete("/menu-category/:id", jwtCheck, jwtParse, CategoryMenuController.deleteCategoryMenu);
// router.get("/menu-category", jwtCheck, jwtParse, CategoryMenuController.getCategoriesMenu);



export default router;