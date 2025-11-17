import {Request, Response} from "express";
import ExcelJS from "exceljs";
import Movement from "../models/movement";

const exportMovementsExcel = async (req: Request, res: Response) => {
    try {
      // Configurar encabezados HTTP
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=movimientos.xlsx"
      );
  
      // Crear libro de Excel con streaming
      const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res });
      const worksheet = workbook.addWorksheet("Movimientos");
  
      // Definir columnas
      worksheet.columns = [
        { header: "Fecha", key: "date", width: 20 },
        { header: "Producto", key: "product", width: 30 },
        { header: "Tipo", key: "type", width: 15 },
        { header: "Cantidad", key: "quantity", width: 12 },
        { header: "Cantidad Anterior", key: "prevQuantity", width: 18 },
        { header: "Cantidad Nueva", key: "newQuantity", width: 18 },
        { header: "Nota", key: "note", width: 40 },
        { header: "Usuario", key: "user", width: 25 },
      ];
  
      // Obtener movimientos (más recientes primero)
      const movements = await Movement.find({})
        .populate("product", "name")
        .populate("user", "role")
        .sort({ date: -1 });
  
      // Agregar filas
      for (const mov of movements) {
        const fecha = mov.date
          ? new Date(mov.date).toLocaleString("es-MX", {
              dateStyle: "short",
              timeStyle: "short",
            })
          : "";
  
        worksheet
          .addRow([
            fecha,
            (mov.product as any)?.name || "Sin producto",
            mov.type,
            mov.quantity,
            mov.prevQuantity ?? "",
            mov.newQuantity ?? "",
            mov.note || "",
            (mov.user as any)?.role || "Sin usuario",
          ])
          .commit();
      }
  
      await worksheet.commit();
      await workbook.commit();
    } catch (error) {
      console.error("Error exporting movements:", error);
      res.status(500).json({ message: "Error exporting movements to Excel" });
    }
  };

const getMovements = async(req: Request, res: Response) =>{
    try{
        const movements = await Movement.find({}).populate("product").populate("user").sort({date: -1});
        res.status(200).json(movements);

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Unable to fetch all movements"});
    }
}

export default {
    getMovements,
    exportMovementsExcel,
    
}