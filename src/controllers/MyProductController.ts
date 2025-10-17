import {Request, Response} from "express";
import Product from "../models/product";
import Movement from "../models/movement";

const addProduct = async(req: Request, res: Response)=> {
    try{
        const { codeNum, name, unitprice, quantityInStock, unit, category, note } = req.body;
        const userId = req.userId;

        if(!userId){
            res.status(401).json({message: "user not found"});

        }

        const exisitingProduct = await Product.findOne({codeNum});
        if(exisitingProduct){
            res.status(409).json({message: "This product already exists"});
            return;
        }
        const total = unitprice * quantityInStock;

        const product = new Product({codeNum, name, category, unit, quantityInStock, unitprice, total});
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

const editProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { quantityInStock, note } = req.body;
      const userId = req.userId;
  
      // Buscar producto
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "The product was not found" });
      }
  
      const prevQuantity = product.quantityInStock;
      let movementType: "entrada" | "salida" | null = null;
      let quantityChange = 0;
  
      // Actualizar stock si cambió
      if (quantityInStock !== undefined && quantityInStock !== prevQuantity) {
        if (quantityInStock > prevQuantity) {
          movementType = "entrada";
          quantityChange = quantityInStock - prevQuantity;
        } else {
          movementType = "salida";
          quantityChange = prevQuantity - quantityInStock;
        }
  
        product.quantityInStock = quantityInStock;
        product.total = product.unitprice * quantityInStock;
        await product.save();
      } else {
        return res
          .status(400)
          .json({ message: "No change in stock quantity" });
      }
  
      // Crear movimiento
      const movement = new Movement({
        product: product._id,
        type: movementType!,
        quantity: quantityChange,
        prevQuantity,
        newQuantity: product.quantityInStock,
        note: note || (movementType === "entrada" ? "Entrada de stock" : "Salida de stock"),
        user: userId,
      });
  
      await movement.save();
  
      res
        .status(201)
        .json({ product: product.toObject(), movement: movement.toObject() });
    } catch (error) {
      console.log(error);
      res.status(500).json("Unable to edit product stock");
    }
  };
  


const getMyProducts = async(req: Request, res: Response) =>{
    try{
        const products = await Product.find({}).populate("category");
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
      const { id } = req.params;
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
    
}
