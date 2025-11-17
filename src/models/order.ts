
import mongoose from "mongoose";

const dishSchema = new mongoose.Schema({
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
  quantity: { type: Number, required: true, default: 1 },
  note: { type: String },
  subtotal: { type: Number },
  status: {
    type: String,
    enum: ["pendiente", "en preparacion", "listo para servir", "entregado"],
    default: "pendiente",
  },
  sent: {type: Boolean, default: false},
});

const orderSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  dishes: [dishSchema],
  total: { type: Number, required: true },
  waiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
