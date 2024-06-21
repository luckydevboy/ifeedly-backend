import { ObjectId } from "mongoose";

import { IComment } from "./index";

interface Post {
  content: string;
  reactions: {
    likes: string[];
    comments: IComment[];
  };
  author: ObjectId;
}

export default Post;
