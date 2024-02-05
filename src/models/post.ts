import mongoose, { ObjectId, Schema } from "mongoose";

export interface IPost {
  content: string;
  reactions: {
    likes: string[];
  };
  author: ObjectId;
}

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
