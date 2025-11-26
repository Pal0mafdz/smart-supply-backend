

import { Request, Response } from "express";
import Product from "../models/product";
import Supplier from "../models/supplier";
import { getSupplierRecommendationsFromAgent } from "../ai/supplierAgent";

const getLowStockSupplierRecommendations = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit ?? 5);

    const lowStockProducts = await Product.find({
      minStock: { $gt: 0 },
      $expr: { $lte: ["$quantityInStock", "$minStock"] },
    })
      .populate("category")
      .populate("supplier")
      .limit(limit);

    const results: any[] = [];

    for (const prod of lowStockProducts) {
      const categoryName = (prod as any).category?.name;
      const currentSupplierDoc = (prod as any).supplier as typeof Supplier | undefined;
      const currentSupplierName = (currentSupplierDoc as any)?.supplierName ?? null;

      const unit = (prod as any).unit || null;
      const unitPrice = (prod as any).unitprice || null;

      const recommendations = await getSupplierRecommendationsFromAgent({
        productName: prod.name,
        currentSupplierName,
        categoryName,
        quantityInStock: prod.quantityInStock,
        minStock: prod.minStock,
        unitOfMeasure: unit ?? undefined,
        currentUnitPrice: unitPrice ?? undefined,
      });

      results.push({
        productId: prod._id,
        productName: prod.name,
        quantityInStock: prod.quantityInStock,
        minStock: prod.minStock,
        unitOfMeasure: unit,
        currentUnitPrice: unitPrice,
        currentSupplier: currentSupplierName,
        recommendations,
      });
    }

    res.status(200).json({
      count: results.length,
      items: results,
    });
  } catch (error: any) {
    console.error("Error en getLowStockSupplierRecommendations:", error);
    res.status(500).json({
      message: "Error al generar recomendaciones de proveedores",
      error: error?.message || String(error),
    });
  }
};

const getSupplierRecommendationsForProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const prod = await Product.findById(id)
      .populate("category")
      .populate("supplier");

    if (!prod) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const categoryName = (prod as any).category?.name;
    const currentSupplierDoc = (prod as any).supplier as typeof Supplier | undefined;
    const currentSupplierName = (currentSupplierDoc as any)?.supplierName ?? null;

    const unit = (prod as any).unit || null;
    const unitPrice = (prod as any).unitprice || null;

    const recommendations = await getSupplierRecommendationsFromAgent({
      productName: prod.name,
      currentSupplierName,
      categoryName,
      quantityInStock: prod.quantityInStock,
      minStock: prod.minStock,
      unitOfMeasure: unit ?? undefined,
      currentUnitPrice: unitPrice ?? undefined,
    });

    res.status(200).json({
      productId: prod._id,
      productName: prod.name,
      quantityInStock: prod.quantityInStock,
      minStock: prod.minStock,
      unitOfMeasure: unit,
      currentUnitPrice: unitPrice,
      currentSupplier: currentSupplierName,
      recommendations,
    });
  } catch (error: any) {
    console.error("Error en getSupplierRecommendationsForProduct:", error);
    res.status(500).json({
      message: "Error al generar recomendaciones de proveedores",
      error: error?.message || String(error),
    });
  }
};

export default {
  getLowStockSupplierRecommendations,
  getSupplierRecommendationsForProduct,
};
