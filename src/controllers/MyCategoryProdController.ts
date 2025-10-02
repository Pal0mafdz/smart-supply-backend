import {Request, Response} from "express";
import CategoryProd from "../models/categoryProd";

const addCategoryProd = async(req: Request, res: Response) =>{
    try{

        const {name} = req.body;
        const existingCategoryProduct = await CategoryProd.findOne({name});

        if(existingCategoryProduct){
            res.status(409).json({message: "The given category already exists"});
            return;
        }
        const categoryProd = new CategoryProd({name});
        await categoryProd.save();
        res.status(200).json(categoryProd.toObject());

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Unable to add given category"});
    }

}

const deleteCategoryProd = async(req: Request, res: Response) =>{
    try{
        const {id} = req.params;

        const category = await CategoryProd.findByIdAndDelete(id);

        if(!category){
            res.status(404).json({message: "category not found"});
            return;
        }
        res.status(200).json(category);

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Unable to delete category"});
    }

}

const getCategories = async(req: Request, res: Response) =>{
    try{
        const categories = await CategoryProd.find({});
        res.status(200).json(categories);


    }catch(error){
        console.log(error);
        res.status(500).json({message: "Unable to fetch categories"});
    }

}

export default{
    addCategoryProd,
    deleteCategoryProd,
    getCategories,
}