import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import OrderController from "../controllers/OrderController";

const router = express.Router();


router.post("/", OrderController.seedTables);
router.get("/", jwtCheck, jwtParse, OrderController.getTables);
router.get("/orders", jwtCheck, jwtParse, OrderController.getOrders);

router.get("/over-two-hours", jwtCheck, jwtParse, OrderController.getTablesOverTwoHours);


router.put("/:tableId/open", jwtCheck, jwtParse, OrderController.openTable);
router.post("/order/:orderId/dishes", jwtCheck, jwtParse, OrderController.AddDish);

router.put("/order/:orderId/dishes/:dishId/status", jwtCheck, jwtParse, OrderController.updateDishStatus);

router.get("/order/:orderId/dishes", jwtCheck, jwtParse, OrderController.getDishes);
router.put("/order/:orderId/dishes/:dishId", jwtCheck, jwtParse, OrderController.updateDishInOrder);
router.delete("/order/:orderId/dishes/:dishId", jwtCheck, jwtParse, OrderController.RemoveDish);
router.post("/order/:orderId/send-to-kitchen", jwtCheck, jwtParse, OrderController.sendToKitchen);
router.post("/order/:orderId/send-new-dishes",jwtCheck, jwtParse, OrderController.sendNewDishesToKitchen
  );





export default router;