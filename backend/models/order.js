import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    serviceName: String,
    price: Number,
    date: String,
    time: String,
    paymentMethod: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
