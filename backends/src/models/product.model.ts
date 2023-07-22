import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  name: string;
  description: string;
  richDescription: string;
  image: string;
  images: string[];
  brand: string;
  price: number;
  category: mongoose.Schema.Types.ObjectId;
  countInStock: number;
  rating: number;
  isFeatured: boolean;
  dateCreated: Date;
}

const productSchema: Schema<IProduct> = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  richDescription: { type: String, default: "" },
  image: { type: String, default: "" },
  images: [{ type: String }],
  brand: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  countInStock: { type: Number, required: true, min: 0, max: 255 },
  rating: { type: Number, required: true },
  isFeatured: { type: Boolean, required: false },
  dateCreated: { type: Date, default: Date.now() },
});

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
productSchema.set("toJSON", { virtuals: true });

const product = mongoose.model("Product", productSchema);

export default product;
