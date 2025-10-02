import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import MyUserRoute from "./routes/MyUserRoute";
import MyProductRoute from "./routes/MyProductRoute";



mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=>console.log("Connected to database!!"))

const app = express();
app.use(express.json())
app.use(cors())

//CREAR LA RUTA POR CADA ESQUEMA ->
//lo siguiente que tenemos que hacer es dar de alta
//los elementos del almacen, editar, eliminar etc
//entonces seria ->
//app.use("/api/my/storage", MyStorageRoute);

app.use("/api/my/user", MyUserRoute);
app.use("/api/my/product", MyProductRoute);

app.listen(8000, ()=> {
    console.log("server started at port 8000")
});