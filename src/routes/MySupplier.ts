import express from "express";
import {jwtCheck, jwtParse} from "../middleware/auth"
import SupplierController from "../controllers/SupplierController";
import multer from "multer";


const router = express.Router();
const upload = multer();

router.post("/", jwtCheck,jwtParse, upload.none(), SupplierController.addSupplier);
router.get("/", jwtCheck, jwtParse, SupplierController.getSuppliers);
router.put("/:id", jwtCheck, jwtParse, SupplierController.updateSupplier);
router.get("/:id", jwtCheck, jwtParse, SupplierController.getSupplierById);

export default router;