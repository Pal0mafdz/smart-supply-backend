import mongoose from 'mongoose'


const categoryProdSchema = new mongoose.Schema({
    name: {type: String, required: true},
})


const CategoryProd = mongoose.model("CategoryProd", categoryProdSchema);

export default CategoryProd;