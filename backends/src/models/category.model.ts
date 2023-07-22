import mongoose, { Schema, Document } from "mongoose";

interface ICategory extends Document {
  name: string;
  icon: string;
  color: string;
  image: string;
}

const categorySchema: Schema<ICategory> = new Schema<ICategory>({
  name: { type: String, required: true },
  icon: { type: String, required: false },
  color: { type: String, required: false },
  image: { type: String, required: false },
});

categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

categorySchema.set("toJSON", { virtuals: true });

const category = mongoose.model("Category", categorySchema);

export default category;
