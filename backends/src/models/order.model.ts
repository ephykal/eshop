import mongoose, { Schema, Document } from "mongoose";

interface IOrder extends Document {
  orderItem: mongoose.Schema.Types.ObjectId[];
  shippingAddress1: string;
  shippingAddress2: string;
  city: string;
  zip: string;
  country: string;
  phone: number;
  status: string;
  totalPrice: number;
  user: mongoose.Schema.Types.ObjectId;
  dateOrdered: Date;
}

const orderSchema: Schema<IOrder> = new Schema<IOrder>({
  orderItem: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" }],
  shippingAddress1: { type: String, required: true },
  shippingAddress2: { type: String, required: false },
  city: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: Number },
  status: { type: String, default: "pending" },
  totalPrice: { type: Number },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dateOrdered: { type: Date, default: Date.now },
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
orderSchema.set("toJSON", { virtuals: true });

const order = mongoose.model("Order", orderSchema);

export default order;
