import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import MovementsController from "../controllers/MovementsController";

const router = express.Router();

// router.post("/", jwtCheck, jwtParse, MovementsController.addMovement);
router.get("/", jwtCheck, jwtParse, MovementsController.getMovements);
router.get("/export", jwtCheck, jwtParse, MovementsController.exportMovementsExcel);

export default router;