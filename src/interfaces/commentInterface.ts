import mongoose from "mongoose";

interface Comment {
  content: string;
  author: mongoose.Types.ObjectId | string;
}

export default Comment;
