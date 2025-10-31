import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    number: {type: Number, required: true},
    dishes: [{
        recipe: {type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true},
        quantity: {type: Number, required: true, default: 1},
        note: {type: String},
        subtotal:{ type: Number}, //esto sera el totoal de la cantidad por el costo de receta
    }
    ],
    status: {type: String, enum:["recibido", "en preparacion", "listo para servir", "entregado", "pagado"], default: "recibido"},
    total: {type: Number, required: true}, //suma de todos los dishes individuales
    //cancelaciones?? a traves de una clave con una explicacion

    // tip: {type: Number},


})

const Order = mongoose.model("Order", orderSchema);

export default Order;
