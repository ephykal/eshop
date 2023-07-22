import mongoose, { Schema, Document } from "mongoose";

interface IOrderItem extends Document {
  product: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

const orderItemSchema: Schema<IOrderItem> = new Schema<IOrderItem>({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, required: true },
});

orderItemSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
orderItemSchema.set("toJSON", { virtuals: true });

const orderItem = mongoose.model("OrderItem", orderItemSchema);

export default orderItem;
