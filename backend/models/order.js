import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customerName:String,
    serviceName: String,
    price: Number,
    address: String,
    phoneNumber: String,
    date: String,
    time: String,
    paymentMethod: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
