import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import MyUserRoute from "./routes/MyUserRoute";
import MyProductRoute from "./routes/MyProductRoute";
import MyMovementsRoute from "./routes/MyMovements";



mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=>console.log("Connected to database!!"))

const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/my/user", MyUserRoute);
app.use("/api/my/product", MyProductRoute);
app.use("/api/my/movement", MyMovementsRoute);

app.listen(8000, ()=> {
    console.log("server started at port 8000")
});