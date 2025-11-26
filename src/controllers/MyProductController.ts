import {Request, Response} from "express";
import Product from "../models/product";
import Movement from "../models/movement";
import Shrinkage from "../models/shrinkage";
import ExcelJS from "exceljs";

const getShrinkages = async(req: Request, res: Response)=> {
  try{
    const shrinkages = await Shrinkage.find({}).populate("product").populate("user").sort({date: -1});
        res.status(200).json(shrinkages);

  }catch(error){
    console.log(error);
    res.status(500).json({message:"Unable to fetch shrinkages"});
  }
}

const exportProductsExcel = async(req: Request, res: Response)=> {
  try{
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=productos.xlsx"
    );

    
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res });
    const worksheet = workbook.addWorksheet("Productos");

    worksheet.columns = [
      { header: "Código", key: "codeNum", width: 15 },
      { header: "Nombre", key: "name", width: 30 },
      { header: "Categoría", key: "category", width: 25 },
      { header: "Unidad", key: "unit", width: 12 },
      { header: "Cantidad", key: "quantityInStock", width: 12 },
      { header: "Precio Unitario", key: "unitprice", width: 18 },
      { header: "Total", key: "total", width: 18 },
      { header: "Maximo en el Inventario", key: "maxStock", width: 30 },
      { header: "Minimo en el Inventario", key: "minStock", width: 30 },
      { header: "Proveedor", key: "supplier", width: 25 },
    ];

    const products = await Product.find().populate("category", "name").populate("supplier", "supplierName");

    for (const prod of products) {
      const precioUnitario = `$${prod.unitprice.toFixed(2)}`;
      const total = `$${(prod.total || prod.quantityInStock * prod.unitprice).toFixed(2)}`;
    
      worksheet.addRow([
        prod.codeNum,
        prod.name,
        (prod.category as any)?.name || "Sin categoría",
        prod.unit,
        prod.quantityInStock,
        precioUnitario,
        total,
        prod.maxStock,
        prod.minStock,
        (prod.supplier as any)?.supplierName|| "Sin proveedor",
        
      ]).commit();
    }

    await worksheet.commit();
    await workbook.commit();

  
  }catch(error){
    console.error("Error exporting products:", error);
    res.status(500).json({ message: "Error exporting products to Excel" });
  }
}

// const addShrinkage = async(req: Request, res: Response)=> {
//   try{
//     const userId = req.userId;
//     const { productId, quantityLost, description } = req.body;

//     if (!userId) {
//       res.status(401).json({ message: "User not authorized" });
//       return
//     }

//     if (!productId || !quantityLost || quantityLost <= 0) {
//       res.status(400).json({ message: "Product ID and a valid quantity are required" });
//     }

//     const product = await Product.findById(productId);
//     if (!product) {
//       res.status(404).json({ message: "Product not found" });
//       return 
//     }


//     if (product.quantityInStock < quantityLost) {
//       res.status(400).json({ message: "Not enough stock to register this shrinkage" });
//       return 
//     }

//     const prevQuantity = product.quantityInStock;
//     const newQuantity = prevQuantity - quantityLost;


//     product.quantityInStock = newQuantity;
//     product.total = product.unitprice * newQuantity;
//     await product.save();


//     const movement = new Movement({
//       product: product._id,
//       type: "salida",
//       quantity: quantityLost,
//       prevQuantity,
//       newQuantity,
//       note: description || "Merma registrada",
//       user: userId,
//     });
//     await movement.save();


//     const shrinkage = new Shrinkage({
//       description: description || "Merma registrada",
//       user: userId,
//       product: product._id,
//       date: new Date(),
//     });
//     await shrinkage.save();

//     res.status(201).json({
//       message: "Shrinkage recorded successfully",
//       shrinkage: shrinkage.toObject(),
//       movement: movement.toObject(),
//       product: product.toObject(),
//     });

//   }catch(error){
//     console.log(error)
//     res.status(500).json({message: "unable to add "})
//   }
// }

const addProduct = async(req: Request, res: Response)=> {
    try{
        const { codeNum, name, unitprice, quantityInStock, unit, category, note, minStock, maxStock, supplier } = req.body;
        const userId = req.userId;

        if(!userId){
            res.status(401).json({message: "user not found"});
            return

        }
        

        if(!supplier){
          res.status(401).json({message: "supplier not found"});
          return
        }


        const exisitingProduct = await Product.findOne({codeNum});
        if(exisitingProduct){
            res.status(409).json({message: "This product already exists"});
            return;
        }

        if (minStock && maxStock && Number(maxStock) < Number(minStock)) {
          return res.status(400).json({ message: "maxStock must be greater than or equal to minStock" });
        }

        const total = unitprice * quantityInStock;

        const product = new Product({codeNum, name, category, unit, quantityInStock, unitprice, total, minStock: minStock ?? 0,
          maxStock: maxStock ?? 0, supplier});
        await product.save();

        const movement = new Movement({
            product: product._id,type: "entrada", 
            quantity: quantityInStock, prevQuantity: 0, newQuantity: quantityInStock, 
            note: note || "Alta inicial de producto",
            user: userId,});
            

            await movement.save();

            res.status(201).json({product: product.toObject(), movement: movement.toObject()});

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
}

// const editProduct = async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params;
//       const { quantityInStock, note } = req.body;
//       const userId = req.userId;
  
//       // Buscar producto
//       const product = await Product.findById(id);
//       if (!product) {
//         return res.status(404).json({ message: "The product was not found" });
//       }
  
//       const prevQuantity = product.quantityInStock;
//       let movementType: "entrada" | "salida" | null = null;
//       let quantityChange = 0;
  
//       // Actualizar stock si cambió
//       if (quantityInStock !== undefined && quantityInStock !== prevQuantity) {
//         if (quantityInStock > prevQuantity) {
//           movementType = "entrada";
//           quantityChange = quantityInStock - prevQuantity;
//         } else {
//           movementType = "salida";
//           quantityChange = prevQuantity - quantityInStock;
//         }
  
//         product.quantityInStock = quantityInStock;
//         product.total = product.unitprice * quantityInStock;
//         await product.save();
//       } else {
//         return res
//           .status(400)
//           .json({ message: "No change in stock quantity" });
//       }
  
//       // Crear movimiento
//       const movement = new Movement({
//         product: product._id,
//         type: movementType!,
//         quantity: quantityChange,
//         prevQuantity,
//         newQuantity: product.quantityInStock,
//         note: note || (movementType === "entrada" ? "Entrada de stock" : "Salida de stock"),
//         user: userId,
//       });
  
//       await movement.save();
  
//       res
//         .status(201)
//         .json({ product: product.toObject(), movement: movement.toObject() });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json("Unable to edit product stock");
//     }
//   };


const editProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, quantity, description } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authorized" });
    }

    if (!type || !["entrada", "salida", "merma"].includes(type)) {
      return res.status(400).json({ message: "Invalid movement type" });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

   
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const prevQuantity = product.quantityInStock;
    let newQuantity = prevQuantity;

    
    if (type === "entrada") {
      newQuantity = prevQuantity + quantity;
    }


    if (type === "salida") {
      if (prevQuantity < quantity) {
        return res.status(400).json({ message: "Not enough stock for salida" });
      }
      newQuantity = prevQuantity - quantity;
    }


    let shrinkageRecord = null;
    

    if (type === "merma") {
      if (prevQuantity < quantity) {
        return res
          .status(400)
          .json({ message: "Not enough stock to register shrinkage" });
      }

      newQuantity = prevQuantity - quantity;


      const shrinkage = new Shrinkage({
        description: description || "Merma registrada",
        user: userId,
        product: product._id,
        decQuantity: quantity,
        date: new Date(),
      });

      await shrinkage.save();
      shrinkageRecord = shrinkage.toObject();
    }


    product.quantityInStock = newQuantity;
    product.total = product.unitprice * newQuantity;
    await product.save();

    
    const movement = new Movement({
      product: product._id,
      type,
      quantity,
      prevQuantity,
      newQuantity,
      note:
        description ||
        (type === "entrada"
          ? "Entrada de stock"
          : type === "salida"
          ? "Salida de stock"
          : type === "merma"
          ? "Merma registrada"
          : "Se registro un movimiento"),
      user: userId,
    });

    await movement.save();

    res.status(200).json({
      message: "Stock updated successfully",
      product: product.toObject(),
      movement: movement.toObject(),
    
      shrinkage: shrinkageRecord || null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to edit stock" });
  }
};

  


const getMyProducts = async(req: Request, res: Response) =>{
    try{
        const products = await Product.find({}).populate("category").populate("supplier");
        res.status(200).json(products);

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Unable to fetch products"});
    }

}

const deleteProduct = async(req: Request, res: Response)=> {
    try{
        const {id} = req.params;
        const product = await Product.findByIdAndDelete({id});

        if(!product){
            res.status(404).json({message: "The product was not found"});
            return;
        }
        res.status(200).json(product);



    }catch(error){
        console.log(error);
        res.status(500).json({message: "Unable to delete the selected product"});
    }
}

const getProductById = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product.toObject());
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Unable to fetch product" });
    }
  };




export default{
    addProduct,
    editProduct,
    getMyProducts,
    deleteProduct,
    getProductById,
    exportProductsExcel,
    getShrinkages,
    
}
