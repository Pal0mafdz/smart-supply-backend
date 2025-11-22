import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    auth0: {type: String, required: true},
    email: {type: String, required: true},
    name:  {type: String},
    lastname: {type: String},
    phone: {type: String},
    bio: {type: String},
    avatarUrl: {type: String},
    gender: {type: String, enum: ["masculino", "femenino", "no binario", "otro", "prefiero no decirlo", ""], default: ""},
    role:  {type: String, enum: ["unauthorized", "jefe de cocina", "mesero", "almacenista", "contador", "gerente", "admin", "capitan"], required: true},
}, {timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;