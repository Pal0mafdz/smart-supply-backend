
import mongoose from 'mongoose'

// const historySchema = new mongoose.Schema({
//     type: { type: String, enum: ["entrada", "salida", "ajuste"], required: true},
//     quantity: {type: Number, required: true},
//     previousQuantity: {type: Number},
//     newQuantity: {type: Number},
//     user: {type: String},
//     note: {type: String},
//     date: {type: Date, default: Date.now}
// })

const productSchema = new mongoose.Schema({
    codeNum: {type: String, required: true},
    name: {type: String, required: true},
   // category: {type: String, enum: ["enlatados", "congelados", "secos", "carnes", "lacteos", "frutas", "verduras","especias", "pescados"]},
    category: {type: mongoose.Schema.Types.ObjectId, ref: "CategoryProd", required: true},
    unit: {type: String, required: true}, //unidad kg,caja etc
    quantityInStock: {type: Number, required: true}, //cantidad
    unitprice: {type: Number, required: true}, //precio por unidad
    total: {type:Number}, //total multiplicacion
    // history: [historySchema]

    //huevo
    //caja 
    //tiene que capturar entrada que es como dar de alta
})


const Product = mongoose.model("Product", productSchema);
export default Product;