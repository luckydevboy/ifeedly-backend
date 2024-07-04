import mongoose, { Schema } from "mongoose";

import { IUser } from "../interfaces";

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: [true, "Username is required"] },
    password: { type: String, required: [true, "Password is required"] },
    name: { type: String, required: [true, "Name is required"] },
    image: { type: String },
    role: { type: String, default: "user" },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
