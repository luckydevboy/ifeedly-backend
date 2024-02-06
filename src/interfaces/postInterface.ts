import { ObjectId } from "mongoose";
import { IComment } from "./index";

interface Post {
  content: string;
  reactions: {
    likes: string[];
  };
  author: ObjectId;
  comments: IComment[];
}

export default Post;
