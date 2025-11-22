import {Request, Response} from "express";
import Sale from "../models/sale";
import Product from "../models/product";
import Payment from "../models/payment";
import Order from "../models/order";
import Table from "../models/table";


const getPayments = async(req: Request, res: Response) =>{
  try{
      const payments = await Payment.find({}).populate("user").sort({date: -1}); 
      // const movements = await Payment.find({}).populate("product").populate("user").sort({date: -1});
      res.status(200).json(payments);

  }catch(error){
      console.log(error);
      res.status(500).json({message: "Unable to fetch all movements"});
  }
}

const registerPayment = async(req: Request, res: Response) => {
  try{
    const userId = req.userId;
    const { cartItems, method, reference, orderId } = req.body;

    if (!userId) {
      res.status(401).json({ message: "User not authorized" });
      return;
    }

    if(!orderId){
      res.status(400).json({message: "OrderId is required"});
      return;
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      res.status(400).json({ message: "Cart is empty" });
      return;
    }

    if (!method) {
      res.status(400).json({ message: "Payment method is required" });
      return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // 2) Validar que TODOS los platos estén entregados
    const hasUndelivered = order.dishes.some(
      (d) => d.status !== "entregado"
    );
    if (hasUndelivered) {
      res
        .status(400)
        .json({ message: "Aún hay platillos sin entregar, no se puede cobrar." });
      return;
    }

    let total = order.total;

  
        

      const payment = new Payment({
        method,
        amount: total,
        reference: reference || "",
        paidAt: new Date(),
 
      });
      await payment.save();

      await Table.findOneAndUpdate(
        {order: order._id, state: "abierta"},
        {$set: {state: "cerrada", closedAt: new Date()}}
      )

      
  
      res.status(201).json({
        message: "Payment registered successfully",
        payment: payment.toObject(),

      });
    

  }catch(error){
    console.log(error);
    res.status(500).json({message: "Unable to add payment"})
    
  }
}

const getSales = async(req: Request, res: Response) => {
    try{
        const { startDate, endDate } = req.query;

        let filter: Record<string, any> = {};

        // if (startDate && endDate) {
        //   // inicio de día
        //   const start = new Date(startDate as string);
        //   start.setHours(0, 0, 0, 0);
    
        //   // fin de día
        //   const end = new Date(endDate as string);
        //   end.setHours(23, 59, 59, 999);
    
        //   filter.createdAt = {
        //     $gte: start,
        //     $lte: end,
        //   };
        // }
    

        // if (startDate && endDate) {
        //   filter.createdAt = {
        //     $gte: new Date(startDate as string),
        //     $lte: new Date(endDate as string),
        //   };
        // }
    
        if (startDate && endDate) {
          const start = new Date(startDate as string);
          start.setUTCHours(6, 0, 0, 0); // inicio del día México UTC-6
        
          const end = new Date(endDate as string);
          end.setUTCHours(29, 59, 59, 999); 
          // 23 + 6 = 29 → JS lo convierte automáticamente a 05:59 del día siguiente UTC
        
          filter.createdAt = {
            $gte: start,
            $lte: end
          };
        }

        const sales = await Sale.find(filter)
          .populate("order")
          .populate("recipe")
          .sort({ createdAt: -1 }); 
    
        res.status(200).json(sales);

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Unable to fetch sales"})
    }

}

export const getTopRecipes = async (req: Request, res: Response) => {
    try {

       const limit = parseInt(req.query.limit as string) || 5;
       const {startDate, endDate}= req.query;

       const matchStage: Record<string,any> = {};
       if(startDate && endDate) {
        matchStage.createdAt = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        }
       }
  
  
      const topRecipes = await Sale.aggregate([
        {$match: matchStage},
        {
          $group: {
            _id: "$recipe", 
            totalSales: { $sum: 1 }, // contamos cuántas veces se vendió
            totalRevenue: { $sum: "$price" } // sumamos el ingreso total
          },
        },
        {
          $sort: { totalSales: -1 }, // ordenamos de mayor a menor
        },
        {
          $limit: limit, // límite opcional (top 5 por defecto)
        },
        {
          // Traemos los datos completos de la receta
          $lookup: {
            from: "recipes",
            localField: "_id",
            foreignField: "_id",
            as: "recipeData",
          },
        },
        {
          $unwind: "$recipeData", // aplanamos el array
        },
        {
          $project: {
            _id: 0,
            recipeId: "$_id",
            name: "$recipeData.recipename",
            totalSales: 1,
            totalRevenue: 1,
          },
        },
      ]);
  
      res.status(200).json(topRecipes);
    } catch (error) {
      console.error("Error al obtener las recetas más vendidas:", error);
      res.status(500).json({ message: "Unable to fetch top recipes"});
    }
}


const getSalesByRecipeAndPeriod = async(req: Request, res: Response)=> {
    try{
        const { groupBy = "month", startDate, endDate } = req.query;


        const dateFormats: Record<"day" | "week" | "month" | "year", string> = {
        day: "%Y-%m-%d",
        week: "%Y-%U",
        month: "%Y-%m",
        year: "%Y",
        };


        const groupByKey =
        typeof groupBy === "string" &&
        ["day", "week", "month", "year"].includes(groupBy)
            ? (groupBy as "day" | "week" | "month" | "year")
            : "month";

        const format = dateFormats[groupByKey];

        const matchStage: Record<string, any> = {};
        if (startDate && endDate) {
        matchStage.createdAt = {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string),
        };
        }

        const groupedSales = await Sale.aggregate([
        { $match: matchStage },
        {
            $group: {
            _id: {
                recipe: "$recipe",
                date: { $dateToString: { format, date: "$createdAt" } },
            },
            totalSales: { $sum: 1 },
            totalRevenue: { $sum: "$price" },
            },
        },
        {
            $lookup: {
            from: "recipes",
            localField: "_id.recipe",
            foreignField: "_id",
            as: "recipeData",
            },
        },
        { $unwind: "$recipeData" },
        {
            $project: {
            _id: 0,
            date: "$_id.date",
            recipeId: "$_id.recipe",
            recipeName: "$recipeData.recipename",
            totalSales: 1,
            totalRevenue: 1,
            },
        },
        { $sort: { date: 1, totalSales: -1 } },
        ]);

        res.status(200).json(groupedSales);

    }catch(error){
        console.log(error)
        res.status(500).json({message: "Unable to fetch"})
    }
}


const getSalesByPeriod = async(req: Request, res: Response) => {
    try{
        const { groupBy = "day", startDate, endDate } = req.query;

      
        const dateFormats: Record<"day" | "week" | "month" | "year", string>  = {
          day: "%Y-%m-%d",
          week: "%Y-%U", 
          month: "%Y-%m",
          year: "%Y",
        };
        
            const groupByKey = (typeof groupBy === "string" &&
        ["day", "week", "month", "year"].includes(groupBy))
        ? (groupBy as "day" | "week" | "month" | "year")
        : "day";

        const format = dateFormats[groupByKey];
        
        const matchStage: Record<string, any> = {};
        if (startDate && endDate) {
        matchStage.createdAt = {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string),
        };
        }
    
       

    
        const groupedSales = await Sale.aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: {
                date: { $dateToString: { format, date: "$createdAt" } },
              },
              totalSales: { $sum: 1 },
              totalRevenue: { $sum: "$price" },
            },
          },
          { $sort: { "_id.date": 1 } },
          {
            $project: {
              _id: 0,
              date: "$_id.date",
              totalSales: 1,
              totalRevenue: 1,
            },
          },
        ]);
    
        res.status(200).json(groupedSales);

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Unable to segregate sales"})
    }

}

//traer las ventas del dia 
//traer las ventas de la semana
//traer las ventas por mes 



export default{
    getTopRecipes,
    getSales,
    getSalesByRecipeAndPeriod,
    getSalesByPeriod,
    registerPayment,
    getPayments,
}
