import { Request, Response } from "express";
import Payment from "../models/payment";
import Sale from "../models/sale";
import Order from "../models/order";
import ExcelJS from "exceljs";
import CashSession from "../models/cashsession";

const todayISO = () => new Date().toISOString().slice(0, 10);

export const getCurrentSession = async (req: Request, res: Response) => {
  try {
    const date = (req.query.date as string) || todayISO();

    const session = await CashSession.findOne({ date }).sort({ createdAt: -1 });

    res.json(session ?? null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo sesión de caja" });
  }
};

export const openSession = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { openingAmount, date } = req.body as {
      openingAmount: number;
      date?: string;
    };

    if (!userId) return res.status(401).json({ message: "No autorizado" });
    if (openingAmount < 0) {
      return res.status(400).json({ message: "El monto de apertura no puede ser negativo" });
    }

    const sessionDate = date || todayISO();

    const existingOpen = await CashSession.findOne({
      date: sessionDate,
      status: "abierta",
    });

    if (existingOpen) {
      return res.status(400).json({ message: "Ya hay una caja abierta para este día" });
    }

    const session = await CashSession.create({
      date: sessionDate,
      openingAmount,
      openedAt: new Date(),
      openedBy: userId,
      status: "abierta",
    });

    res.status(201).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error abriendo caja" });
  }
};

export const closeSession = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { realClosingAmount, note, date } = req.body as {
      realClosingAmount: number;
      note?: string;
      date?: string;
    };

    if (!userId) return res.status(401).json({ message: "No autorizado" });

    const sessionDate = date || todayISO();

    const session = await CashSession.findOne({
      date: sessionDate,
      status: "abierta",
    });

    if (!session) {
      return res.status(400).json({ message: "No hay caja abierta para cerrar" });
    }

    const startOfDay = new Date(`${sessionDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${sessionDate}T23:59:59.999Z`);

    // Ventas del día
    const sales = await Sale.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      //saleDate: { $gte: startOfDay, $lte: endOfDay },
    });

    // Pagos del día
    const payments = await Payment.find({
      // createdAt: { $gte: startOfDay, $lte: endOfDay },
      paidAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // Órdenes del día
    const orders = await Order.find({
      // createdAt: { $gte: startOfDay, $lte: endOfDay },
      orderDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const totalSales = sales.reduce((sum: number, s: any) => sum + (Number(s.total ?? s.amount ?? 0) || 0), 0);

    const expectedClosing = session.openingAmount + totalSales;
    const difference = (realClosingAmount || 0) - expectedClosing;

    session.status = "cerrada";
    session.closedAt = new Date();
    session.closedBy = userId;
    session.closingAmount = realClosingAmount;
    session.difference = difference;
    session.note = note;
    await session.save();

    // Generar Excel (3 hojas: pagos, ventas, órdenes)
    const workbook = new ExcelJS.Workbook();
    const sessionTitle = `Caja ${sessionDate}`;

    workbook.creator = "SmartSupply";
    workbook.created = new Date();

    const salesSheet = workbook.addWorksheet("Ventas");
    salesSheet.columns = [
      { header: "ID", key: "id", width: 24 },
      { header: "Fecha", key: "date", width: 20 },
      { header: "Total", key: "total", width: 15 },
    ];
    sales.forEach((s: any) =>
      salesSheet.addRow({
        id: s._id.toString(),
        date: s.createdAt,
        total: Number(s.total ?? s.amount ?? 0),
      })
    );

    const paymentsSheet = workbook.addWorksheet("Pagos");
    paymentsSheet.columns = [
      { header: "ID", key: "id", width: 24 },
      { header: "Fecha", key: "date", width: 20 },
      { header: "Método", key: "method", width: 15 },
      { header: "Ref", key: "reference", width: 20 },
      { header: "Monto", key: "amount", width: 15 },
    ];
    payments.forEach((p: any) =>
      paymentsSheet.addRow({
        id: p._id.toString(),
        date: p.createdAt,
        method: p.method,
        reference: p.reference,
        amount: p.amount,
      })
    );

    const ordersSheet = workbook.addWorksheet("Órdenes");
    ordersSheet.columns = [
      { header: "ID", key: "id", width: 24 },
      { header: "Fecha", key: "date", width: 20 },
      { header: "Mesa", key: "table", width: 10 },
      { header: "Estado", key: "status", width: 15 },
      { header: "Total", key: "total", width: 15 },
    ];
    orders.forEach((o: any) =>
      ordersSheet.addRow({
        id: o._id.toString(),
        date: o.createdAt,
        table: o.tableNumber ?? o.table ?? "",
        status: o.status,
        total: o.total ?? "",
      })
    );

    // Hoja resumen
    const summarySheet = workbook.addWorksheet("Resumen");
    summarySheet.addRow([sessionTitle]);
    summarySheet.addRow([]);
    summarySheet.addRow(["Apertura", session.openingAmount]);
    summarySheet.addRow(["Total ventas", totalSales]);
    summarySheet.addRow(["Esperado", expectedClosing]);
    summarySheet.addRow(["Real", realClosingAmount]);
    summarySheet.addRow(["Diferencia", difference]);
    if (note) summarySheet.addRow(["Notas", note]);

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="cierre-caja-${sessionDate}.xlsx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    return res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error cerrando caja" });
  }
};
