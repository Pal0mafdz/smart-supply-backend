import express from "express";
//import MyUserController from "../controllers/MyUserController";
import {jwtCheck, jwtParse} from "../middleware/auth"
import MyProductController from "../controllers/MyProductController";
import MyCategoryProdController from "../controllers/MyCategoryProdController";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/", jwtCheck, jwtParse, upload.none(),  MyProductController.addProduct);
router.put("/:id", jwtCheck, jwtParse, MyProductController.editProduct);
router.get("/", jwtCheck, jwtParse, MyProductController.getMyProducts );
router.get("/export", jwtCheck, jwtParse, MyProductController.exportProductsExcel);


router.post("/category", jwtCheck, MyCategoryProdController.addCategoryProd);
router.get("/category", jwtCheck, jwtParse,MyCategoryProdController.getCategories);
router.get("/shrinkages", jwtCheck, jwtParse, MyProductController.getShrinkages)
router.delete("/category/:id", jwtCheck, jwtParse, MyCategoryProdController.deleteCategoryProd);

// hasta el final las que usan /:id
router.delete("/:id", jwtCheck, jwtParse, MyProductController.deleteProduct);
router.get("/:id", jwtCheck, jwtParse, MyProductController.getProductById);




export default router;