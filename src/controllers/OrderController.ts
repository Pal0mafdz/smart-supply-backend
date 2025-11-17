import {Request, Response} from "express";
import Table from "../models/table";
import Recipe from "../models/recipe";
import Order from "../models/order";
import Sale from "../models/sale";


const getTablesOverTwoHours = async(req: Request, res: Response)=> {
  try{

      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);


      const tables = await Table.find({
        state: "abierta",
        openedAt: { $lte: twoHoursAgo },
      }).populate("waiter", "email");

      const now = Date.now();

      const result = tables.map((t: any) => {
        const openedAt = t.openedAt ? new Date(t.openedAt) : null;
        const minutesOpen = openedAt
          ? Math.floor((now - openedAt.getTime()) / 60000)
          : null;

        return {
          id: t._id,
          number: t.number,
          area: t.area,
          customers: t.customers,
          waiterName: t.waiter?.email ?? "Sin mesero",
          openedAt,
          minutesOpen,
        };
      });

      res.status(200).json(result);

  }catch(error){
    console.log(error);
    res.status(500).json({message: "Unable to fetch tables over 2 hours open"})
  }
}

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
  
      
      const nextOrderNumber = (await Order.countDocuments()) + 1;
  
      const newOrder = new Order({
        number: nextOrderNumber,
        dishes: [],
        total: 0,
        // status: "creado", 
        waiter: req.userId,
      });
  
      await newOrder.save();
  

      table.order.push(newOrder._id);
      await table.save();
  

      res.status(200).json({
        message: "Table opened and new order created",
        table: table.toObject(),
        // order: newOrder.toObject(),
        order: newOrder._id,
      });

      // res.status(200).json({
      //   message: "Table opened and new order created",
      //   table: table._id,
      //   order: newOrder._id,
      // });
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

    if (!order || !recipe){
      res.status(404).json({ message: "Order or recipe not found" });
      return
    }

    if (recipe.totalCost == null) {
            throw new Error("Recipe totalCost is not defined");
      }

    const subtotal = recipe.totalCost * quantity;
    const existingDish = order.dishes.find(
      (d) => d.recipe.toString() === recipeId && d.status === "pendiente"
    );

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
        status: "pendiente",
      });
    }

    order.total = order.dishes.reduce((acc, d) => acc + (d.subtotal ?? 0), 0);
    await order.save();

    const populated = await Order.findById(orderId).populate(
      "dishes.recipe",
      "recipename totalCost"
    );

    res.status(200).json({ message: "Dish added successfully", order: populated });
     
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unable to add dish" });
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

        if(quantity !==undefined && quantity < 1){
          order.dishes.pull(dishId);
        }else{

        if(quantity !== undefined){
            dish.quantity = quantity;
        }
        if(note !== undefined){
            dish.note = note;
        }

        const recipe = dish.recipe as any;
        dish.subtotal = (recipe.totalCost ?? 0) * dish.quantity;
       }

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

    const order = await Order.findById(orderId)
      .populate("dishes.recipe") // 👈 esto es lo que hace la magia
      .populate("waiter", "name");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ dishes: order.dishes });
        // const { orderId } = req.params;

        // const order = await Order.findById(orderId).populate("dishes.recipe", "recipename totalCost");
        // if (!order) {
        //     res.status(404).json({ message: "Order not found" });
        //     return;
        // }

        // const getdishes = order.dishes.map(dish => ({
        //     _id: dish._id,
        //     recipeId: (dish.recipe as any)._id,
        //     name: (dish.recipe as any).recipename,
        //     quantity: dish.quantity,
        //     note: dish.note,
        //     subtotal: dish.subtotal,
        //     totalCost: (dish.recipe as any).totalCost,
        // }));
        // res.status(200).json({orderId: order._id, total: order.total, dishes: getdishes});

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Failed to fetch dishes"});
    }
}

const getOrders = async(req: Request, res: Response) => {
  try{
   

    const { userId, userRole } = req;

    let filter = {};

    if (userRole === "mesero") {
      filter = { waiter: userId };
    }


    const orders = await Order.find(filter)
      .populate("dishes.recipe", "recipename totalCost")
      .populate("waiter", "name");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
    

  }catch(error){
    console.log(error);
    res.status(500).json({message: "Unable to fetch orders"})
  }
}


const sendToKitchen = async(req: Request, res: Response) => {
  try{
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("dishes.recipe");
    if (!order) {
       res.status(404).json({ message: "Order not found" });
       return;
    }

    const sales = [];

    for (const dish of order.dishes) {
      if(!dish.sent){
        dish.sent = true;
        dish.status = "en preparacion";

        const recipe = dish.recipe as any;
        const sale = new Sale({
          order: order._id,
          recipe: recipe._id,
          price: recipe.totalCost,
        });
        await sale.save();
        sales.push(sale);
      }
    }

    await order.save();
    res.status(200).json({ message: "Dishes sent to kitchen", order, sales });
  

  }catch(error){
    console.log(error);
    res.status(500).json({message: "Unable to send"})
    
  }
}

const sendNewDishesToKitchen = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("dishes.recipe");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const newSales = [];

    
    const newDishes = order.dishes.filter((dish) => !dish.sent);

    if (newDishes.length === 0) {
      return res.status(200).json({ message: "No hay nuevos platillos para enviar" });
    }

    for (const dish of newDishes) {
      dish.sent = true;
      dish.status = "en preparacion";

      const recipe = dish.recipe as any;
      const sale = new Sale({
        order: order._id,
        recipe: recipe._id,
        price: recipe.totalCost,
      });

      await sale.save();
      newSales.push(sale);
    }

    await order.save();

    res.status(200).json({
      message: "Nuevos platillos enviados a cocina",
      newDishes,
      sales: newSales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al enviar los nuevos platillos" });
  }
};


const updateDishStatus = async(req: Request, res: Response) => {
  try{
    const { orderId, dishId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order){
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const dish = order.dishes.id(dishId);
    if (!dish) {
      res.status(404).json({ message: "Dish not found" });
      return;
    }

    dish.status = status;
    await order.save();

    res.status(200).json({ message: "Dish status updated", dish });
    

  }catch(error){
    console.log(error);
    res.status(500).json({message: "Unable to update the status "})
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
    updateDishStatus,
    getOrders,
    sendToKitchen,
    sendNewDishesToKitchen,
    getTablesOverTwoHours,

}