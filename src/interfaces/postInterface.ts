import { ObjectId } from "mongoose";

import { IComment } from "./index";

interface Post {
  content: string;
  reactions: {
    likes: string[];
    comments: IComment[];
  };
  author: ObjectId;
  images?: {
    publicId: string;
    secureUrl: string;
    format: string;
    resourceType: string;
    bytes: number;
    createdAt: string;
  }[];
}

export default Post;
