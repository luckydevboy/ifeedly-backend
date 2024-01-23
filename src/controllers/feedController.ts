import { Request, Response } from "express";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { Post } from "../models";

export const getFeed = async (req: Request, res: Response) => {
  const file = await fs.readFile(`${__dirname}/../../data/feed.json`, "utf-8");
  const feed: Post[] = JSON.parse(file);

  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  const feedToShow = feed
    .slice(startIndex, endIndex)
    .sort(
      (a, b) =>
        new Date(b.created_time).getTime() - new Date(a.created_time).getTime(),
    );

  res.json({
    data: feedToShow,
    total: feed.length,
    currentPage: page,
    pageSize: pageSize,
  });
};

export const postToFeed = async (req: Request, res: Response) => {
  const file = await fs.readFile(`${__dirname}/../data/feed.json`, "utf-8");
  const data = JSON.parse(file);
  data.push({
    content: req.body.content,
    id: uuidv4(),
    created_time: new Date().toISOString(),
    author: "John Doe", // You may replace this with actual author data
    reactions: { likes: 0, comments: 0 },
    username: "john@doe", // You may replace this with actual username data
  });

  fs.writeFile(
    `${__dirname}/../data/feed.json`,
    JSON.stringify(data, null, 2),
    "utf-8",
  );

  res.status(201).json(req.body);
};
