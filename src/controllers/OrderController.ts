import {Request, Response} from "express";
import Table from "../models/table";
import Recipe from "../models/recipe";
import Order from "../models/order";

const seedTables = async(req: Request, res: Response)=> {
    try{
        

    const count = await Table.countDocuments();
    if (count > 0) {
      return res.status(400).json({ message: "Tables already exist" });
    }

    const tables = Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      state: "disponible",
     capacity: [2, 6, 4][i % 3], // alterna entre 2, 4 y 6 sillas
      area: i < 8 ? "Area Principal" : "Terraza", //
    }));

    await Table.insertMany(tables);
    res.status(201).json({ message: "Tables created successfully", tables });
 


    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong"});

    }
}

const getTables = async(req: Request, res: Response)=> {
    try{
        const tables = await Table.find({});
        if(!tables){
            res.status(404).json({message: "Tables not found"});
        }
        res.status(200).json(tables);

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Unable to fetch tables" });
    }
}


const openTable = async (req: Request, res: Response) => {
    try {
      const { tableId } = req.params;
      const { customers } = req.body;
  
      const table = await Table.findById(tableId);
  
      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }
  
      if (table.state === "abierta") {
        return res.status(400).json({ message: "Table is already open" });
      }
  
      if (customers > (table.capacity ?? 0)) {
        return res.status(400).json({
          message: "There is no space for the number of customers on this table",
        });
      }
  
      // Actualizar estado de la mesa
      table.state = "abierta";
      table.customers = customers;
      table.openedAt = new Date();
  
      // Crear nueva orden asociada a esta apertura
      const nextOrderNumber = (await Order.countDocuments()) + 1;
  
      const newOrder = new Order({
        number: nextOrderNumber,
        dishes: [],
        total: 0,
        status: "recibido", // primer estado por defecto
      });
  
      await newOrder.save();
  
      // Asociar la nueva orden a la mesa
      table.order.push(newOrder._id);
      await table.save();
  
      // Responder con mesa y orden
      res.status(200).json({
        message: "Table opened and new order created",
        table: table.toObject(),
        order: newOrder.toObject(),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };
  


const AddDish = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const { recipeId, quantity = 1, note = "" } = req.body;


    const recipe = await Recipe.findById(recipeId);
    const order = await Order.findById(orderId);

   
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return
    }

    if (!recipe) {
      res.status(404).json({ message: "Recipe not found" });
      return
    }

    if (recipe.totalCost == null) {
      throw new Error("Recipe totalCost is not defined");
    }

 
    const existingDish = order.dishes.find(
      (d) => d.recipe.toString() === recipeId
    );

    const subtotal = recipe.totalCost * quantity;

    if (existingDish) {
      existingDish.quantity += quantity;
      existingDish.subtotal = (existingDish.subtotal ?? 0) + subtotal;
      if (note) existingDish.note = note;
    } else {
      order.dishes.push({
        recipe: recipe._id,
        quantity,
        note,
        subtotal,
      });
    }


    order.total = order.dishes.reduce((acc, d) => acc + (d.subtotal ?? 0), 0);

    await order.save();

    const populated = await Order.findById(orderId).populate("dishes.recipe", "recipename totalCost");

    const dishes = populated!.dishes.map(d => ({
      id: d._id,
      recipeId: (d.recipe as any)._id,
      name: (d.recipe as any).recipename,
      quantity: d.quantity,
      note: d.note,
      subtotal: d.subtotal,
      totalCost: (d.recipe as any).totalCost,
    }));

    res.status(200).json({
      message: "Dish added successfully",
      orderId: populated!._id,
      total: populated!.total,
      dishes,
    });

    // res.status(200).json({order});
     
     
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };
  

const updateDishInOrder = async(req: Request, res: Response)=>{
    try{
        const {orderId, dishId} = req.params;
        const {quantity, note} = req.body;

        const order = await Order.findById(orderId).populate("dishes.recipe");
        if(!order){
            res.status(404).json({message: "Order not found"});
            return;
        }

        const dish = order.dishes.id(dishId);
        if(!dish){
            res.status(404).json({message: "Dish not found"});
            return;
        }

        if(quantity !== undefined){
            dish.quantity = quantity;
        }
        if(note !== undefined){
            dish.note = note;
        }

        const recipe = dish.recipe as any;
        dish.subtotal = (recipe.totalCost ?? 0) * dish.quantity;

        order.total = order.dishes.reduce((acc, d) => acc + (d.subtotal ?? 0), 0);

        await order.save();
        res.status(200).json({ message: "Dish updated", order });


    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }

}

const RemoveDish = async(req: Request, res: Response)=> {
    try{
        const { orderId, dishId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });
    
        const dish = order.dishes.id(dishId);
        if (!dish) return res.status(404).json({ message: "Dish not found" });
    
        order.dishes.pull(dish._id);
        order.total = order.dishes.reduce((acc, d) => acc + (d.subtotal ?? 0), 0);
    
        await order.save();
    
        res.status(200).json({ message: "Dish removed successfully", order });

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
        
    }

}

const getDishes = async(req: Request, res: Response)=> {
    try{
        const { orderId } = req.params;

        const order = await Order.findById(orderId).populate("dishes.recipe", "recipename totalCost");
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        const getdishes = order.dishes.map(dish => ({
            id: dish._id,
            recipeId: (dish.recipe as any)._id,
            name: (dish.recipe as any).recipename,
            quantity: dish.quantity,
            note: dish.note,
            subtotal: dish.subtotal,
            totalCost: (dish.recipe as any).totalCost,
        }));
        res.status(200).json({orderId: order._id, total: order.total, dishes: getdishes});

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
}

const getOrders = async(req: Request, res: Response) => {
  try{
    const orders = await Order.find({});
    if(!orders){
      res.status(404).json({message: "No order was found"});
      return;
    }

    res.status(200).json(orders);
    

  }catch(error){
    console.log(error);
    res.status(500).json({message: "Unable to fetch orders"})
  }
}

export default{
    openTable,
    AddDish,
    updateDishInOrder,
    RemoveDish,
    getDishes,
    seedTables,
    getTables,

}