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
            //se tiene que calcular en el middleware
            unitprice: {type: Number},
            cost: {type: Number},
        },
        
    ],
    totalCost: {type: Number}, //esta sera la suma de los productos, soy Paloma no chat jajaj
    description: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});

recipeSchema.pre("save", async function (next) {
    const Product = mongoose.model("Product");
    let total = 0;
    
    for(let item of this.products){
        const prod = await Product.findById(item.product);
        if(!prod) continue;

        item.unitprice = prod.unitprice;
        item.cost = item.quantity * prod.unitprice;
        total += item.cost;
    }
    this.totalCost = total;
    next();

    
});

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;