import mongoose, { Schema } from "mongoose";

import { IComment, IPost } from "../interfaces";

const commentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const postSchema = new Schema<IPost>(
  {
    content: { type: String, required: true },
    reactions: {
      likes: { type: [String], default: [] },
      comments: { type: [commentSchema], default: [] },
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
