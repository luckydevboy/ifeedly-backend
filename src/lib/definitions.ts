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

export type User = {
  id: string;
  created_time: string;
  username: string;
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
};
