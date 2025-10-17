import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    recipename: {type: String, required: true},
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,

            },
            quantity: {type: Number, required: true},
            cost: {type: Number},
        },
        
    ],
    totalCost: {type: Number}, //esta sera la suma de los productos, soy Paloma no chat jajaj
    description: {type: String, required: true},
    imageUrl: {type: String, required:true},
    typeOR: {type:String, enum: ["Entradas", "Platos fuertes","Postres"]},
    createdAt: {type: Date, default: Date.now}
});



const Recipe = mongoose.model("Recipe", recipeSchema);

 export default Recipe;
