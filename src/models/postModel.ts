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
    content: { type: String, required: [true, "Content is required"] },
    reactions: {
      likes: { type: [String], default: [] },
      comments: { type: [commentSchema], default: [] },
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    images: [
      {
        publicId: String,
        secureUrl: String,
        format: String,
        resourceType: String,
        bytes: Number,
        createdAt: String,
      },
    ],
  },
  { timestamps: true },
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
