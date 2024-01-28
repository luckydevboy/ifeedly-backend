import mongoose, { Schema } from "mongoose";

export interface User {
  _id?: string;
  username: string;
  password: string;
  name: string;
}

const userSchema = new Schema<User>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true },
);

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
