import mongoose, { Schema } from "mongoose";

export interface IUser {
  _id?: string;
  username: string;
  password: string;
  name: string;
  image: string;
  role: string;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    role: { type: String, default: "user" },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
