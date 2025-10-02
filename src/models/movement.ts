import mongoose, { mongo } from "mongoose";

const movementSchema = new mongoose.Schema({
    product: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
    type: {type: String, enum:["entrada", "salida", "ajuste"], required: true},
    quantity: {type: Number, required: true},
    prevQuantity: {type: Number, required: true},
    newQuantity: {type: Number, required: true},
    note: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    date: {type: Date, default: Date.now},


})

const Movement = mongoose.model("Movement", movementSchema);
export default Movement;