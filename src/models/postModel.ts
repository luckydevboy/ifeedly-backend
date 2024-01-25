import { User } from "./userModel";

export interface Post {
  content: string;
  id: string;
  created_time: string;
  reactions: {
    likes: number;
    comments: number;
  };
  user: Pick<User, "id" | "username" | "name">;
}
