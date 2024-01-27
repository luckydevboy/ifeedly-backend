import mongoose, { ObjectId, Schema } from "mongoose";

export interface Post {
  content: string;
  reactions: {
    likes: string[];
  };
  userId: ObjectId;
}

const postSchema = new Schema<Post>(
  {
    content: { type: String, required: true },
    reactions: {
      likes: { type: [String], default: [] },
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const PostModel = mongoose.model<Post>("Post", postSchema);

export default PostModel;
