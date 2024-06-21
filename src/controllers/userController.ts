import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { User } from "../models";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = token ? (jwt.decode(token) as JwtPayload) : null;
    const user = await User.findOne({ _id: decoded?.id }).select("-password");

    return res.json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (
      userId !==
      (req as Request & { user: { id: string; iat: number } }).user.id
    ) {
      return res.status(401).json({
        status: "error",
        message: "You are not eligible to update other users' data!",
      });
    }

    const { username, name } = req.body;

    if (!username && !name) {
      return res.status(400).json({
        status: "error",
        message: "Username or name are required!",
      });
    }

    if (username) {
      const existingUser = await User.findOne({ username });

      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(409).json({
          status: "error",
          message: "Username is already in use",
        });
      }
    }

    if (name) {
      const existingUser = await User.findOne({ name });

      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(409).json({
          status: "error",
          message: "Name is already in use",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, name },
      {
        new: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
