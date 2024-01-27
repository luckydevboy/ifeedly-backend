import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PostModel } from "../models";

interface JwtPayload {
  id: string;
  iat: number;
}

export const getPosts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize || 0)
      .limit(pageSize || 10)
      .exec();

    const total = await PostModel.countDocuments();

    res.json({
      status: "success",
      data: {
        posts: posts.map((post) => ({
          ...post.toObject(),
          reactions: {
            ...post.toObject().reactions,
            likes: post.toObject().reactions.likes.length,
          },
        })),
        total,
        currentPage: page,
        pageSize,
      },
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const decoded = jwt.decode(
      String(req.headers.authorization?.split(" ")[1]),
    ) as JwtPayload;

    const post = new PostModel({
      content: req.body.content,
      userId: decoded.id,
    });

    await post.save();

    return res.status(201).json({ status: "success", data: { post } });
  } catch (error) {
    console.error("Error creating post:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const decoded = jwt.decode(
      String(req.headers.authorization?.split(" ")[1]),
    ) as JwtPayload;

    const post = await PostModel.findById(req.params.postId);

    if (!post) {
      return res
        .status(404)
        .json({ status: "error", message: "Post not found" });
    }

    // Check if the user has already liked the post
    const indexOfUser = post.reactions.likes.indexOf(decoded.id);
    if (indexOfUser !== -1) {
      post.reactions.likes.splice(indexOfUser, 1);
    } else {
      post.reactions.likes.push(decoded.id);
    }

    await post.save();

    return res.json({
      status: "success",
      data: {
        posts: {
          ...post.toObject(),
          reactions: {
            ...post.toObject().reactions,
            likes: post.toObject().reactions.likes.length,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error liking post:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};
