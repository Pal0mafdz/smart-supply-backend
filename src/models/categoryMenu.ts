import mongoose from 'mongoose'


const categoryMenuSchema = new mongoose.Schema({
    name: {type: String, required: true},
})


const CategoryMenu = mongoose.model("CategoryMenu", categoryMenuSchema);

export default CategoryMenu;