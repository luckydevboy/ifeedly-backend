import mongoose, { Schema } from "mongoose";
import { IPost } from "../interfaces";

const postSchema = new Schema<IPost>(
  {
    content: { type: String, required: true },
    reactions: {
      likes: { type: [String], default: [] },
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
