import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    


})
const Sale = mongoose.model("Sale", saleSchema);
export default Sale;