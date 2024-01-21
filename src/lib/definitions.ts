export type Post = {
  id: string;
  created_time: string;
  content: string;
  author: string;
  reactions: {
    likes: number;
    comments: number;
  };
  username: string;
};
