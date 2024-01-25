import { Request, Response } from "express";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { Post, User } from "../models";

export const getFeed = async (req: Request, res: Response) => {
  const file = await fs.readFile(`${__dirname}/../../data/feed.json`, "utf-8");
  const feed: Post[] = JSON.parse(file);

  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  const feedToShow = feed
    .sort(
      (a, b) =>
        new Date(b.created_time).getTime() - new Date(a.created_time).getTime(),
    )
    .slice(startIndex, endIndex);

  res.json({
    data: feedToShow,
    total: feed.length,
    currentPage: page,
    pageSize: pageSize,
  });
};

interface JwtPayload {
  id: string;
  iat: number;
}

export const postFeed = async (req: Request, res: Response) => {
  const decoded = jwt.decode(
    String(req.headers.authorization?.split(" ")[1]),
  ) as JwtPayload;

  const feedFile = await fs.readFile(
    `${__dirname}/../../data/feed.json`,
    "utf-8",
  );
  const usersFile = await fs.readFile(
    `${__dirname}/../../data/users.json`,
    "utf-8",
  );

  const feed = JSON.parse(feedFile);
  const users: User[] = JSON.parse(usersFile);

  const user = users.find((user) => user.id === decoded.id);

  const post = {
    content: req.body.content,
    id: uuidv4(),
    created_time: new Date().toISOString(),
    reactions: { likes: 0, comments: 0 },
    user: {
      id: user?.id,
      name: user?.name,
      username: user?.username,
    },
  };

  feed.push(post);

  fs.writeFile(
    `${__dirname}/../../data/feed.json`,
    JSON.stringify(feed, null, 2),
    "utf-8",
  );

  res.status(201).json(post);
};
