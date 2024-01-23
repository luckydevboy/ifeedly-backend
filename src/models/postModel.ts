export interface Post {
  content: string;
  id: string;
  created_time: string;
  author: string;
  reactions: {
    likes: number;
    comments: number;
  };
  username: string;
}
