import mongoose from "mongoose";

const cashSessionSchema = new mongoose.Schema({
    
      date: { type: String, required: true, index: true },
      openingAmount: { type: Number, required: true },
      closingAmount: { type: Number },
      difference: { type: Number },
      note: { type: String },
      openedAt: { type: Date, required: true },
      closedAt: { type: Date },
      openedBy: { type: String, required: true },
      closedBy: { type: String },
      status: { type: String, enum: ["abierta", "cerrada"], required: true },
    },
    { timestamps: true }
 );
  
  // Solo 1 sesión abierta a la vez por día
  cashSessionSchema.index({ date: 1, status: 1 }, { unique: true, partialFilterExpression: { status: "abierta" } });

  const CashSession = mongoose.model("CashSession", cashSessionSchema);

  export default CashSession;
