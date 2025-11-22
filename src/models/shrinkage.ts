import mongoose from "mongoose";

const shrinkageSchema = new mongoose.Schema({
    description: {type : String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    product: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
    decQuantity: {type: Number},
    date: {type: Date, required: true}, 
    
})
const Shrinkage = mongoose.model("Shrinkage", shrinkageSchema);

 export default Shrinkage;
