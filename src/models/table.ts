import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true},
    waiter: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    state: {type: String, enum:["abierta", "cerrada", "reservada", "disponible"], default: "disponible"},
    order: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Order",}
    ],
    capacity: {type: Number},
    area: {type: String, enum:["Terraza", "Area Principal"]},
    openedAt: {type: Date,},
    closedAt: {type: Date,},
    customers: {type: Number, default: 0},
    },
    // { timestamps: true }
);

const Table = mongoose.model("Table", tableSchema);

export default Table;