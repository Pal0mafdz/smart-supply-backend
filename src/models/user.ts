import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    auth0: {type: String, required: true},
    email: {type: String, required: true},
    name:  {type: String},
    role:  {type: String, enum: ["unauthorized", "jefe de cocina", "mesero", "almacenista", "contador", "gerente", "admin"]},
})

const User = mongoose.model("User", userSchema);
export default User;