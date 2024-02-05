import { ObjectId } from "mongoose";

interface Post {
  content: string;
  reactions: {
    likes: string[];
  };
  author: ObjectId;
}

export default Post;
