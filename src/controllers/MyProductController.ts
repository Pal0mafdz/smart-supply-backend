import {Request, Response} from "express";
import Product from "../models/product";

const addProduct = async(req: Request, res: Response) =>{
    try{
       const {codeNum, name, unitprice, quantityInStock, unit} = req.body;
        
       const existingProduct = await Product.findOne({codeNum});

        if(existingProduct){
            res.status(409).json({message: "You've already uploaded this product"});
            return;
        }
        const total = unitprice * quantityInStock; 

        const product = new Product(req.body, total);
        await product.save();
        res.status(201).json(product.toObject());

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Unable to add product"});
    }

}

const editProduct = async(req: Request, res: Response) => {
    try{
        const {id} = req.params;

        const {codeNum, name, category, unit, quantityInStock, unitprice} = req.body;

        //buscar
        const product = await Product.findById(id);
        if(!product){
            res.status(404).json({message: "The product was not found"});
            return;
        }

        product.codeNum = codeNum;
        product.name = name;
        product.category = category;
        product.unit = unit;
        product.quantityInStock = quantityInStock;
        product.unitprice = unitprice;
        product.total = unitprice * quantityInStock;

        await product.save();
        res.status(201).json(product.toObject());

    }catch(error){
        console.log(error);
        res.status(500).json("Unable to edit product");
    }
}

const getMyProducts = async(req: Request, res: Response) =>{
    try{
        const products = await Product.find({});
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