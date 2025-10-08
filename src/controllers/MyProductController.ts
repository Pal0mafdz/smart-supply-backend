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

const editProduct = async(req: Request, res: Response) => {
    try{
        const {id} = req.params;

       const {unit, unitprice, quantityInStock, note} = req.body;
       const userId = req.userId;
        //buscar
        const product = await Product.findById(id);
        if(!product){
            res.status(404).json({message: "The product was not found"});
            return;
        }

        const prevQuantity = product.quantityInStock;
        const prevPrice = product.unitprice;

        let movementType: "entrada" | "salida" | "ajuste" | null = null;
        let quantityChange = 0;

        if(quantityInStock !== undefined && quantityInStock !== prevQuantity){
            if(quantityInStock > prevQuantity){
                movementType = "entrada";
                quantityChange = quantityInStock - prevQuantity;
            }else {
                movementType = "salida";
                quantityChange = prevQuantity - quantityInStock;
            }
            product.quantityInStock = quantityInStock;
        }

        // if(unitprice !== undefined && unitprice !== prevPrice){
        //     product.unitprice = unitprice || quantityInStock === prevQuantity;
        // }

        if (unitprice !== undefined && unitprice !== prevPrice &&
            (quantityInStock === undefined || quantityInStock === prevQuantity)
          ) {
            movementType = "ajuste";
          }
      
          if (unitprice !== undefined) {
            product.unitprice = unitprice;
          }

        product.total = product.unitprice * product.quantityInStock;
        await product.save();



        let movement = null;
        if (movementType) {
            movement = new Movement({
              product: product._id,
              type: movementType,
              quantity:
                movementType === "ajuste"
                  ? 0
                  : quantityChange, // si es ajuste, cantidad = 0
              prevQuantity,
              newQuantity: product.quantityInStock,
              note:
                note ||
                (movementType === "entrada"
                  ? "Entrada adicional de producto"
                  : movementType === "salida"
                  ? "Salida por ajuste de stock"
                  : "Ajuste de precio unitario"),
              user: userId,
            });
      
        // if(movementType){
        //     movement = new Movement({
        //         product: product._id,
        //         type: movementType,
        //         quantity: quantityChange,
        //         prevQuantity,
        //         newQuantity: product.quantityInStock,
        //         note: note || (movementType === "entrada"
        //         ? "Entrada adicional de producto"
        //         : movementType === "salida"
        //         ? "Salida por ajuste de stock"
        //         : "Ajuste de informacion del producto"),
        //         user: userId,
        //     });

          
            await movement.save();
        }

        res.status(201).json({product: product.toObject(), movement: movement?.toObject()});

    }catch(error){
        console.log(error);
        res.status(500).json("Unable to edit product");
    }
}

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
