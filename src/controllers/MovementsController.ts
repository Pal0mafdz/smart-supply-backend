import {Request, Response} from "express";
import Product from "../models/product";

const addMovement = async(req: Request, res: Response) =>{
    try{
        const {productId, quantity, user, note, type} = req.body;
        const product = await Product.findById(productId);
        //ver si el producto existe
        if(!product){
            res.status(404).json({message: "Product not found"});
            return
        }
        //si el producto existe hay que validar la salida primero
        if(type === "salida" ){
            if(product.quantityInStock < quantity){
                res.status(402).json({message: "No stock left"});
                return;
            }
            
        }



    }catch(error){
        console.log(error);
        res.status(500).json({message: "Unable to add movement"});
    }

}