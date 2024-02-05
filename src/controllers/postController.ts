import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Post } from "../models";

interface JwtPayload {
  id: string;
  iat: number;
}

export const getPosts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = token ? (jwt.decode(token) as JwtPayload) : null;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize || 0)
      .limit(pageSize || 10)
      .populate({
        path: "author",
        select: "username name image -_id",
      })
      .exec();

    const total = await Post.countDocuments();

    let postsWithLikes;

    if (decoded) {
      postsWithLikes = posts.map((post) => {
        const isLiked = post.reactions.likes.includes(decoded.id);
        return {
          ...post.toObject(),
          reactions: {
            ...post.toObject().reactions,
            likes: post.toObject().reactions.likes.length,
            isLiked,
          },
        };
      });
    } else {
      // If there is no authenticated user, return posts without liking information
      postsWithLikes = posts.map((post) => ({
        ...post.toObject(),
        reactions: {
          ...post.toObject().reactions,
          likes: post.toObject().reactions.likes.length,
        },
      }));
    }

    res.json({
      status: "success",
      data: {
        total,
        posts: postsWithLikes,
      },
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id).populate({
      path: "author",
      select: "username name image -_id",
    });

    res.json({
      status: "success",
      data: {
        post,
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

    const post = new Post({
      content: req.body.content,
      author: decoded.id,
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

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res
        .status(404)
        .json({ status: "error", message: "PostModel not found" });
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
        post: {
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
