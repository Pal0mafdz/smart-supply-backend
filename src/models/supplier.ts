import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    supplierName: {type: String, required: true},
    email: {type: String},
    phone: {type: String},
    website: {type: String},
    leadTimeDays: { type: Number, default: 3 }, // tiempo de entrega
    minOrderValue: { type: Number, default: 0 }, // mínimo por compra
    // active: { type: Boolean, default: true }, 
})
const Supplier = mongoose.model("Supplier", supplierSchema);

 export default Supplier;
