import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { query, validationResult, param, body } from "express-validator";

import { Post } from "../models";

interface JwtPayload {
  id: string;
  iat: number;
}

export const getPosts = async (req: Request, res: Response) => {
  // Validate request parameters
  await query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .run(req);
  await query("pageSize")
    .optional()
    .isInt({ min: 1 })
    .withMessage("PageSize must be a positive integer")
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", errors: errors.array() });
  }

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
            comments: post.toObject().reactions.comments.length,
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
          comments: post.toObject().reactions.comments.length,
          likes: post.toObject().reactions.likes.length,
        },
      }));
    }

    return res.json({
      status: "success",
      data: {
        total,
        posts: postsWithLikes,
      },
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};

export const getPost = async (req: Request, res: Response) => {
  // Validate request parameters
  await param("id").isMongoId().withMessage("Invalid post ID").run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", errors: errors.array() });
  }

  try {
    const id = req.params.id;
    const post = await Post.findById(id)
      .populate({
        path: "author",
        select: "username name image -_id",
      })
      .populate({
        path: "reactions.comments.author",
        model: "User",
        select: "username name image -_id",
      });

    return res.json({
      status: "success",
      data: {
        post: {
          ...post?.toObject(),
          reactions: {
            ...post?.toObject().reactions,
            likes: post?.toObject().reactions.likes.length,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};

export const createPost = async (req: Request, res: Response) => {
  // Validate request body
  await body("content").notEmpty().withMessage("Content is required").run(req);
  await body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array")
    .custom((images) => {
      for (const image of images) {
        if (!image.publicId || typeof image.publicId !== "string") {
          throw new Error(
            "Each image must have a valid publicId of type string",
          );
        }
        if (!image.secureUrl || typeof image.secureUrl !== "string") {
          throw new Error(
            "Each image must have a valid secureUrl of type string",
          );
        }
        if (!image.format || typeof image.format !== "string") {
          throw new Error("Each image must have a valid format of type string");
        }
        if (!image.resourceType || typeof image.resourceType !== "string") {
          throw new Error(
            "Each image must have a valid resourceType of type string",
          );
        }
        if (typeof image.bytes !== "number") {
          throw new Error("Each image must have a valid bytes of type number");
        }
        if (!image.createdAt || typeof image.createdAt !== "string") {
          throw new Error(
            "Each image must have a valid createdAt of type string",
          );
        }
      }
      return true;
    })
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", errors: errors.array() });
  }

  try {
    const decoded = jwt.decode(
      String(req.headers.authorization?.split(" ")[1]),
    ) as JwtPayload;

    const post = new Post({
      content: req.body.content,
      author: decoded.id,
      ...(req.body.images && { images: req.body.images }),
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
  // Validate request parameters
  await param("postId").isMongoId().withMessage("Invalid post ID").run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", errors: errors.array() });
  }

  try {
    const decoded = jwt.decode(
      String(req.headers.authorization?.split(" ")[1]),
    ) as JwtPayload;

    const post = await Post.findById(req.params.postId);

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

export const createComment = async (req: Request, res: Response) => {
  // Validate request parameters and body
  await param("postId").isMongoId().withMessage("Invalid post ID").run(req);
  await body("content").notEmpty().withMessage("Content is required").run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", errors: errors.array() });
  }

  const postId = req.params.postId;
  const { content } = req.body;
  const decoded = jwt.decode(
    String(req.headers.authorization?.split(" ")[1]),
  ) as JwtPayload;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = { content, author: decoded.id };
    post.reactions.comments.unshift(newComment);

    await post.save();

    return res.json({
      status: "success",
      data: {
        comment: newComment,
      },
    });
  } catch (error) {
    console.error("Error liking post:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};
