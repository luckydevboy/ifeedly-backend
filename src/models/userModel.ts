import mongoose, { Schema } from "mongoose";

import { IUser } from "../interfaces";

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String },
    role: { type: String, default: "user" },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
