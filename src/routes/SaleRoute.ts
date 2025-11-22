import express from "express";

import {jwtCheck, jwtParse} from "../middleware/auth"
import SaleController from "../controllers/SaleController";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, SaleController.getSales);
router.get("/paymemts", jwtCheck, jwtParse, SaleController.getPayments);
router.post("/register-payment", jwtCheck, jwtParse, SaleController.registerPayment);
router.get("/top-recipes", jwtCheck, jwtParse, SaleController.getTopRecipes);
router.get("/by-period", jwtCheck, jwtParse, SaleController.getSalesByPeriod);
router.get("/by-recipe-and-period", jwtCheck, jwtParse, SaleController.getSalesByRecipeAndPeriod);



 

export default router;