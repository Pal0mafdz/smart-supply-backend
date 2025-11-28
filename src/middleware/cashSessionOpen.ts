import { Request, Response, NextFunction } from "express";
import CashSession from "../models/cashsession";
// import CashSession from "../models/cashSession";
// import { todayISO } from "../utils/date"; // o vuelve a definir

export const requireOpenCashSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const date = todayISO();
    const session = await CashSession.findOne({ date, status: "abierta" });

    if (!session) {
      return res.status(403).json({
        message: "Caja cerrada. Abre la caja para abrir mesas o crear órdenes.",
      });
    }

    // Si quieres, puedes poner info de la sesión en el request:
    (req as any).cashSession = session;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verificando caja" });
  }
};
function todayISO() {
    throw new Error("Function not implemented.");
}

