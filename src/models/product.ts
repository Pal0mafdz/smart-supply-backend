
import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    codeNum: {type: String, required: true},
    name: {type: String, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: "CategoryProd", required: true},
    unit: {type: String, required: true}, //unidad kg,caja etc
    quantityInStock: {type: Number, required: true}, //cantidad
    unitprice: {type: Number, required: true}, //precio por unidad
    total: {type:Number}, //total multiplicacion
    date: {type: Date, default: Date.now},
    // supplier: {type: mongoose.Schema.Types.ObjectId, ref: "Supplier"},
    


})

//

const Product = mongoose.model("Product", productSchema);
export default Product;