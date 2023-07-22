import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  street: string;
  apartment: string;
  city: string;
  zip: string;
  country: string;
  phone: number;
  isAdmin: boolean;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlenth: 8 },
  street: { type: String, default: "" },
  apartment: { type: String, default: "" },
  city: { type: String, default: "" },
  zip: { type: String, default: "" },
  country: { type: String, default: "" },
  phone: { type: Number, required: true },
  isAdmin: { type: Boolean, default: false },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", { virtuals: true });

const user = mongoose.model("User", userSchema);

export default user;
