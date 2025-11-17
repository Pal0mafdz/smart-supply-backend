import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  method: { type: String, enum: ["tarjeta", "efectivo"], required: true },
  amount: { type: Number, required: true, min: 0 },
  reference: { type: String, default: "" },  
  paidAt: { type: Date, default: Date.now },
  cashier: {type: mongoose.Schema.ObjectId, ref: "User" },
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;