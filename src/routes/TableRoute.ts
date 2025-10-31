import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import OrderController from "../controllers/OrderController";
const router = express.Router();


router.post("/", OrderController.seedTables);
router.get("/", jwtCheck, jwtParse, OrderController.getTables);

router.put("/:tableId/open", jwtCheck, jwtParse, OrderController.openTable);
router.post("/order/:orderId/dishes", jwtCheck, jwtParse, OrderController.AddDish);

router.get("/order/:orderId/dishes", jwtCheck, jwtParse, OrderController.getDishes);
router.put("/order/:orderId/:dishId", jwtCheck, jwtParse, OrderController.updateDishInOrder);
router.delete("/order/orderId/:dishId", jwtCheck, jwtParse, OrderController.RemoveDish);





export default router;