
import mongoose from 'mongoose'

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