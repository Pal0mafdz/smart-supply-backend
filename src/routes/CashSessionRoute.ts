import express from "express";
import { getCurrentSession, openSession, closeSession } from "../controllers/CashSessionController";
import { jwtCheck, jwtParse } from "../middleware/auth"; 

const router = express.Router();

router.get("/current",jwtCheck, jwtParse, getCurrentSession);
router.post("/open", jwtCheck, jwtParse, openSession);
router.post("/close",jwtCheck, jwtParse, closeSession);

export default router;
