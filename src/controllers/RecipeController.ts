import {Request, Response} from "express";
import Recipe from "../models/recipe";
import cloudinary from 'cloudinary';
import Product from "../models/product";



const uploadImage = async (file: Express.Multer.File) =>{
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    return uploadResponse.url;
}

const addRecipe = async (req: Request, res: Response) => {
    try {

      const { recipename, description, typeOR } = req.body;
      let { products } = req.body;

      if (!recipename || !description) {
        return res.status(400).json({ message: "Recipename and description are required" });
      }

      const validTypes = ["Desayunos", "Entradas", "Platos fuertes", "Postres"];
      if (!typeOR || !validTypes.includes(typeOR)) {
        res.status(400).json({ message: "Invalid or missing typeOR value" });
        return;
     }


      if (!products) {
        return res.status(400).json({ message: "Products are required" });
      }

      if (typeof products === "string") {
        products = JSON.parse(products);
      }

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "Products array cannot be empty" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      const imageUrl = await uploadImage(req.file);

      // Procesar productos y calcular costos
      let totalCost = 0;
      const processedProducts = [];

      for (const item of products) {
        const prod = await Product.findById(item.productId);

        if (!prod) {
          return res.status(400).json({ message: `Product ${item.productId} not found` });
        }

        const cost = prod.unitprice * item.quantity;
        totalCost += cost;

        processedProducts.push({
          product: prod._id,
          quantity: item.quantity,
          cost,
        });
      }

      // Guardar receta
      const recipe = new Recipe({
        recipename,
        description,
        products: processedProducts,
        totalCost,
        imageUrl,
        typeOR,
      });

      const savedRecipe = await recipe.save();
      res.status(201).json(savedRecipe);
    } catch (error: any) {
      console.error("Error creating recipe:", error);
      res.status(500).json({ message: "Unable to add recipe", error: error.message });
    }
  };






const getRecipes = async(req: Request, res: Response) => {
    try{
        const recipes = await Recipe.find({}).populate("products.product");
        res.status(200).json(recipes);

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Unable to fetch recipes"});
    }
}


const deleteRecipes = async(req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const recipe = await Recipe.findByIdAndDelete(id);

        if(!recipe){
            res.status(404).json({message: "The recipe was not found"});
            return;
        }
        res.status(200).json(recipe);



    }catch(error){
        console.log(error);
        res.status(500).json({message: "Unable to delete the selected recipe"});
    }

}


const editRecipe = async(req: Request, res: Response) => {
   try{
    const {id} = req.params;
    const {recipename, description, typeOR} = req.body;
    let {products} = req.body;

    console.log("receta", req.body);
    if(!recipename || !description){
      res.status(400).json({message: "Recipe name and description are required"});
      return;
    }

    const existingRecipe = await Recipe.findById(id);
    if(!existingRecipe){
      res.status(404).json({message: "Recipe not found"});
      return;
    }

    const validTypes = ["Desayunos", "Entradas", "Platos fuertes", "Postres"];
    if (!typeOR || !validTypes.includes(typeOR)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing typeOR value" });
    }

    if(!products){
      res.status(400).json({message: "Products are required"});
      return;
    }

    if(typeof products === "string"){
      products = JSON.parse(products);
    }

    if(!Array.isArray(products) || products.length === 0){
      res.status(400).json({message: "Products array cannot be empty"});
      return;
    }

    let imageUrl = existingRecipe.imageUrl;
    if(req.file){
      imageUrl = await uploadImage(req.file);
    }

    //AQUI RECALCULAMOS LOS COSTOS
    let totalCost = 0;
    const processedProducts = [];

    for(const item of products){
      const prod = await Product.findById(item.productId);
      if(!prod){
        res.status(400).json({message: `Product ${item.productId} not found`});
        return;
      }
      const cost = prod.unitprice * item.quantity;
      totalCost += cost;

      processedProducts.push({
        product: prod._id,
        quantity: item.quantity,
        cost,
      });
    }

    existingRecipe.set({
      recipename,
      description,
      products: processedProducts,
      totalCost,
      imageUrl,
      typeOR,
    });

    const updatedRecipe = await existingRecipe.save();
    res.status(200).json(updatedRecipe);

  

   }catch(error){
    console.log(error);
    res.status(500).json({message: "Unable to edit Recipe"});

   }

}


export default {
    addRecipe,
    deleteRecipes,
    getRecipes,
    editRecipe,

}